"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin } from "lucide-react";

export type AddressParts = {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
};

interface AddressAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (parts: AddressParts) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

interface PlacePrediction {
  placeId: string;
  text: { text: string };
  mainText?: { text: string };
  secondaryText?: { text: string };
  toPlace: () => {
    fetchFields: (opts: { fields: string[] }) => Promise<void>;
    formattedAddress?: string;
    addressComponents?: { longText: string; shortText: string; types: string[] }[];
  };
}

interface Suggestion {
  placePrediction: PlacePrediction;
}

type AutocompleteSessionToken = object;

interface PlacesLibrary {
  AutocompleteSessionToken: new () => AutocompleteSessionToken;
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions: (
      request: Record<string, unknown>,
    ) => Promise<{ suggestions?: Suggestion[] }>;
  };
}

const SCRIPT_ID = "finevu-google-maps-places";

declare global {
  interface Window {
    google?: {
      maps?: {
        importLibrary?: (libraryName: string) => Promise<unknown>;
      };
    };
  }
}

// Loads the Google Maps JS SDK exactly once per page. Resolves only once
// google.maps.importLibrary is actually callable — the script's load event can
// fire a beat before the bootstrap defines it, so we poll to avoid that race.
function loadGoogleMaps(apiKey: string): Promise<void> {
  const isReady = () =>
    typeof window !== "undefined" && typeof window.google?.maps?.importLibrary === "function";

  return new Promise((resolve, reject) => {
    if (isReady()) {
      resolve();
      return;
    }
    const waitUntilReady = () => {
      const started = Date.now();
      const timer = window.setInterval(() => {
        if (isReady()) {
          window.clearInterval(timer);
          resolve();
        } else if (Date.now() - started > 10000) {
          window.clearInterval(timer);
          reject(new Error("Google Maps importLibrary unavailable"));
        }
      }, 50);
    };

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      waitUntilReady();
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&loading=async&libraries=places`;
    script.onload = () => waitUntilReady();
    script.onerror = () => reject(new Error("Google Maps script failed to load"));
    document.head.appendChild(script);
  });
}

// Maps the new Places API address components onto the form's split fields.
function toAddressParts(
  components: { longText: string; shortText: string; types: string[] }[] | undefined,
): AddressParts {
  const find = (type: string) => components?.find((c) => c.types?.includes(type));
  const streetNumber = find("street_number")?.longText ?? "";
  const route = find("route")?.longText ?? "";
  const subpremise = find("subpremise")?.longText ?? "";
  const locality =
    find("locality")?.longText ?? find("postal_town")?.longText ?? find("sublocality")?.longText ?? "";
  const state = find("administrative_area_level_1")?.shortText ?? "";
  const postcode = find("postal_code")?.longText ?? "";
  const base = [streetNumber, route].filter(Boolean).join(" ");
  const street = base ? (subpremise ? `${subpremise}/${base}` : base) : "";
  return { street, suburb: locality, state, postcode };
}

/**
 * Google Places Autocomplete for Australian addresses (Places API — new
 * AutocompleteSuggestion). The input is always interactive; suggestions are an
 * additive layer, so a missing key, unloaded script or failed request just
 * degrades to a plain text input. The dropdown renders in a portal so it is
 * never clipped by the booking card's overflow.
 */
export function AddressAutocomplete({
  id,
  value,
  onChange,
  onSelect,
  placeholder,
  required,
  className,
}: AddressAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [placesLib, setPlacesLib] = useState<PlacesLibrary | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [rect, setRect] = useState<{ left: number; top: number; width: number } | null>(null);

  const sessionTokenRef = useRef<AutocompleteSessionToken | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestSeqRef = useRef(0);

  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    loadGoogleMaps(apiKey)
      .then(async () => {
        if (cancelled) return;
        const lib = (await window.google!.maps!.importLibrary!("places")) as PlacesLibrary;
        if (cancelled) return;
        setPlacesLib(lib);
        sessionTokenRef.current = new lib.AutocompleteSessionToken();
      })
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[AddressAutocomplete] Places API unavailable:", err);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  const positionDropdown = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ left: r.left, top: r.bottom + 8, width: r.width });
  }, []);

  const fetchSuggestions = useCallback(
    async (input: string) => {
      if (!placesLib || !input || input.trim().length < 3) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      const seq = ++requestSeqRef.current;
      // Returns the suggestion list, or null when the request errors (e.g. an
      // unsupported primary-type filter) so the caller can retry more broadly.
      const tryFetch = async (extra: Record<string, unknown>): Promise<Suggestion[] | null> => {
        try {
          const result = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input,
            includedRegionCodes: ["au"],
            sessionToken: sessionTokenRef.current,
            ...extra,
          });
          return (result?.suggestions ?? []) as Suggestion[];
        } catch (err) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[AddressAutocomplete] Failed to fetch suggestions:", err);
          }
          return null;
        }
      };

      let next = await tryFetch({ includedPrimaryTypes: ["street_address", "premise", "subpremise"] });
      if (seq !== requestSeqRef.current) return;
      if (next === null || next.length === 0) {
        next = await tryFetch({});
        if (seq !== requestSeqRef.current) return;
      }
      const list = next ?? [];
      setSuggestions(list);
      if (list.length > 0) positionDropdown();
      setOpen(list.length > 0);
      setActiveIndex(-1);
    },
    [placesLib, positionDropdown],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  // Fire once the library finishes loading if the user already typed enough.
  useEffect(() => {
    if (!placesLib || !value || value.trim().length < 3) return;
    fetchSuggestions(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesLib]);

  // Keep the portal dropdown glued to the input while open.
  useEffect(() => {
    if (!open) return;
    const update = () => positionDropdown();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, positionDropdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (suggestion: Suggestion) => {
    const fallback = suggestion.placePrediction.text.text;
    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({ fields: ["formattedAddress", "addressComponents"] });
      const parts = toAddressParts(place.addressComponents);
      onChange(parts.street || place.formattedAddress || fallback);
      onSelect?.(parts);
    } catch {
      onChange(fallback);
    }
    setOpen(false);
    setActiveIndex(-1);
    setSuggestions([]);
    if (placesLib) sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const showDropdown = open && suggestions.length > 0 && rect;

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) {
            positionDropdown();
            setOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        role="combobox"
        aria-expanded={!!showDropdown}
        aria-autocomplete="list"
        aria-controls={showDropdown ? `${id}-listbox` : undefined}
        aria-activedescendant={activeIndex >= 0 && id ? `${id}-option-${activeIndex}` : undefined}
        className={className}
      />

      {showDropdown &&
        createPortal(
          <ul
            id={`${id}-listbox`}
            role="listbox"
            style={{ position: "fixed", left: rect.left, top: rect.top, width: rect.width, zIndex: 60 }}
            className="max-h-72 overflow-auto rounded-xl border border-[#e8e7e2] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
          >
            {suggestions.map((suggestion, index) => {
              const pred = suggestion.placePrediction;
              const main = pred.mainText?.text || pred.text.text;
              const secondary = pred.secondaryText?.text;
              const isActive = index === activeIndex;
              return (
                <li
                  key={`${pred.placeId}-${index}`}
                  id={id ? `${id}-option-${index}` : undefined}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(suggestion);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors ${
                    isActive ? "bg-[#fff1e8]" : "hover:bg-[#f7f6f3]"
                  }`}
                >
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#9a9da5]" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-[#1d1d1f]">{main}</div>
                    {secondary && <div className="truncate text-xs text-[#6b6b73]">{secondary}</div>}
                  </div>
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}
