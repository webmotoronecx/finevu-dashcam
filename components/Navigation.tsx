"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { Logo } from "@/components/Logo";
import { ProductSubNav } from "@/components/ProductSubNav";
import { glassBorderClass, glassStyle } from "@/components/navGlass";

// Featured products shown in the Products mega-menu panel (per Figma 17:7267).
const dropdownProducts = [
  {
    href: "/gx4k",
    name: "GX4K",
    subtitle: "True 4K UHD · SONY STARVIS",
    image: "/products/gx4k-card.jpg",
    badge: "4K UHD",
    badgeClass: "bg-[#f47920]",
  },
  {
    href: "/gx35",
    name: "GX35",
    subtitle: "Premium 2K Camera · Front & Rear",
    image: "/products/gx35-card.jpg",
    badge: "2K · Best Value",
    badgeClass: "bg-[#0b0b0c]",
  },
];

// Find Retailer pill — solid brand orange per Figma v4 (node 113:3356).
const CTA_ORANGE = "#F68428";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const pathname = usePathname();
  const productsBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusFirstOnOpen = useRef(false);

  // Product-page variant: full-width nav block + sticky sub-nav row. Driven purely by
  // whether the current route has a sub-nav entry in the config.
  const subNav = siteConfig.productSubNav[pathname] ?? null;
  const [docked, setDocked] = useState(false);
  const [mainRowHeight, setMainRowHeight] = useState(0);
  const mainRowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Past 100px from the top the main row swipes up and the sub-nav docks at the top.
  // The 90px undock point is hysteresis — it keeps a scroll position sitting exactly on
  // the boundary from flickering between the two states.
  useMotionValueEvent(scrollY, "change", (y) => {
    if (!subNav) return;
    setDocked((prev) => (prev ? y > 90 : y > 100));
  });

  // Measure the main row so the stack can slide up by exactly its height, landing the
  // sub-nav flush at top: 0. Re-measures on breakpoint changes / logo reflow.
  useEffect(() => {
    const el = mainRowRef.current;
    if (!subNav || !el) return;
    const measure = () => setMainRowHeight(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [subNav]);

  // Both menus hang off the main row — pointless once that row is off-screen.
  useEffect(() => {
    if (!docked) return;
    setProductsOpen(false);
    setIsMobileMenuOpen(false);
  }, [docked]);

  // Sync on mount / route change: a reload or an anchor deep-link can land well past
  // 100px without ever firing a scroll event, and 100px is easy to exceed.
  useEffect(() => {
    setDocked(!!subNav && window.scrollY > 100);
  }, [pathname, subNav]);

  const focusFirstItem = () => {
    panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  };

  // Close the Products mega-menu on Escape and restore focus to its trigger.
  useEffect(() => {
    if (!productsOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProductsOpen(false);
        productsBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [productsOpen]);

  // Move focus into the panel only when it was opened via the keyboard
  // (ArrowDown/Up on the trigger). Mouse / Enter open keeps focus on the trigger.
  useEffect(() => {
    if (productsOpen && focusFirstOnOpen.current) {
      focusFirstOnOpen.current = false;
      focusFirstItem();
    }
  }, [productsOpen]);

  // Roving focus through the menu items with arrow / Home / End keys.
  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
    );
    if (items.length === 0) return;
    const current = items.indexOf(document.activeElement as HTMLElement);
    let next = -1;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = current < 0 ? 0 : (current + 1) % items.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = current <= 0 ? items.length - 1 : current - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = items.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    items[next]?.focus();
  };

  // Sample the section under the navbar to theme the glass + text colours.
  // Keyed on `pathname` so a client-side navigation re-samples: no scroll event
  // fires on route change, so without this the navbar keeps the previous page's
  // theme (white text on a light page) until the user nudges the wheel.
  useEffect(() => {
    const sample = () => {
      const x = window.innerWidth / 2;
      const y = 40;
      const elements = document.elementsFromPoint(x, y);
      for (const el of elements) {
        if (el.closest("nav")) continue;
        const section = el.closest("[data-nav-theme]");
        if (section) {
          setIsDarkBackground(section.getAttribute("data-nav-theme") === "dark");
          return;
        }
      }
      setIsDarkBackground(window.scrollY < 50);
    };

    window.addEventListener("scroll", sample, { passive: true });
    window.addEventListener("resize", sample);

    // Sample after the new route has painted — on navigation the pathname
    // updates before the incoming section is in the document, so an immediate
    // read would still hit the outgoing page (or nothing at all).
    const raf = requestAnimationFrame(() => requestAnimationFrame(sample));

    // Late-mounting content (ComingSoonGate's ?showpage swap, images/video that
    // resize a hero) can change what sits under the navbar after that frame.
    // Coalesce to one sample per frame — elementsFromPoint forces layout and
    // AnimatePresence mounts fire this in bursts.
    let pending = 0;
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        sample();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", sample);
      window.removeEventListener("resize", sample);
      cancelAnimationFrame(raf);
      if (pending) cancelAnimationFrame(pending);
      observer.disconnect();
    };
  }, [pathname]);

  // Close menus on route change.
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  const { nav, primaryCta } = siteConfig;
  const productsItem = nav.find((n) => n.children);
  const flatLinks = nav.filter((n) => !n.children);

  // Translucent glass surface, themed to the section under the navbar (shared with
  // <ProductSubNav> via components/navGlass.ts).
  const pillStyle = glassStyle(isDarkBackground);

  const lBase = isDarkBackground
    ? "text-white/85 hover:text-white"
    : "text-zinc-600 hover:text-zinc-950";
  const lActive = isDarkBackground ? "text-white" : "text-zinc-950";

  // Plain, chrome-free routes render the page content only (no site nav).
  if (pathname === "/fv-specialist") return null;

  return (
    <>
      {/* Click-away backdrop while the Products panel is open */}
      <AnimatePresence>
        {productsOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setProductsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 ${subNav ? "" : "px-4 md:px-8"}`}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Product pages slide the whole stack up by the main row's height, which docks
            the sub-nav flush at top: 0. One transform, no second sticky element. */}
        <motion.div
          animate={{ y: subNav && docked ? -mainRowHeight : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
        {/* On product pages the pill becomes a full-bleed glass block; the surface spans
            the viewport while the content below stays capped at 1400px. */}
        <div
          ref={mainRowRef}
          {...(subNav && docked ? { inert: true, "aria-hidden": true as const } : {})}
          // `navigation-main` is an unstyled hook for finding this row in devtools.
          className={`navigation-main ${subNav ? `w-full border-b ${glassBorderClass(isDarkBackground)} py-3` : ""}`}
          style={subNav ? pillStyle : undefined}
        >
        {/* Row: centered glass pill (logo + links) with the Find Retailer button
            floating to the right — per Figma v4 (pill 113:3561, button 113:3356). */}
        {/* xl:pr reserves a gutter on the right so the centered pill can never
            slide under the absolutely-positioned Find Retailer button. */}
         {/* ZEUS remove the padding right coz we already have a mobile view for navigation    */}
        <div
          className={`relative z-50 mx-auto max-w-[1400px] flex items-center ${
            subNav ? "gap-6 px-4 md:px-8" : "mt-4 md:mt-6 justify-center"
          }`}
        >
          {/* Centered pill (product pages: the row itself, unstyled and full width) */}
          <div
            className={`relative z-10 flex w-full items-center justify-between gap-4 ${
              subNav
                ? "min-w-0 xl:flex-1"
                : "xl:w-auto xl:justify-center xl:gap-24 rounded-full border px-5 py-2 xl:px-10 xl:py-3 " +
                  glassBorderClass(isDarkBackground)
            }`}
            style={subNav ? undefined : pillStyle}
          >
            {/* Logo — orange/grey wordmark */}
            <Link href="/" aria-label="FineVu home" className="flex min-h-[44px] items-center shrink-0">
              <Logo variant="primary" className="w-[136px] h-[33px] sm:w-[150px] sm:h-[36px] object-contain transition-transform duration-300 hover:scale-105" />
            </Link>

            {/* Desktop links — Products ⌄ / Installation / Retailers / Support */}
            <div className="hidden xl:flex items-center gap-7">
              {productsItem && (
                <button
                  ref={productsBtnRef}
                  onClick={() => setProductsOpen((v) => !v)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                      e.preventDefault();
                      if (productsOpen) {
                        focusFirstItem();
                      } else {
                        focusFirstOnOpen.current = true;
                        setProductsOpen(true);
                      }
                    }
                  }}
                  className={`relative text-[16px] tracking-[-0.3px] transition-colors flex items-center gap-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--finevu-orange)] focus-visible:ring-offset-2 ${
                    productsOpen
                      ? "font-semibold text-[var(--finevu-orange)]"
                      : `font-medium ${lBase}`
                  }`}
                  aria-haspopup="menu"
                  aria-expanded={productsOpen}
                  aria-controls="products-menu"
                >
                  {productsItem.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`}
                  />
                  {productsOpen && (
                    <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[var(--finevu-orange)] rounded-full" />
                  )}
                </button>
              )}
              {flatLinks.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[16px] tracking-[-0.3px] font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--finevu-orange)] focus-visible:ring-offset-2 ${active ? lActive + " font-semibold" : lBase}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className={`xl:hidden shrink-0 -mr-2 inline-flex items-center justify-center min-w-11 min-h-11 ${isDarkBackground ? "text-white" : "text-zinc-900"}`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Find Retailer — solid orange. Floats to the right of the pill normally; on
              product pages it sits inline as the last item in the full-width row. */}
          <Link
            href={primaryCta.href}
            className={`hidden xl:block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--finevu-orange)] focus-visible:ring-offset-2 ${
              subNav ? "shrink-0" : "absolute right-0 top-1/2 -translate-y-1/2"
            }`}
          >
            <motion.button
              className="cta-hover text-white font-semibold text-[14px] uppercase leading-[20px] px-9 py-4 rounded-full"
              style={{ backgroundColor: CTA_ORANGE }}
            >
              {primaryCta.label}
            </motion.button>
          </Link>
        </div>
        </div>

        {/* Product-page sub-nav — the row that stays behind once the main row swipes up */}
        {subNav && <ProductSubNav entry={subNav} isDark={isDarkBackground} />}
        </motion.div>

        {/* Products mega-menu — floating white panel centered below the pill */}
        <AnimatePresence>
          {productsOpen && (
            <motion.div
              key="products-panel"
              id="products-menu"
              role="menu"
              aria-label="Dash cameras"
              ref={panelRef}
              onKeyDown={handlePanelKeyDown}
              className="hidden xl:block absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 rounded-[28px] bg-white border border-black/[0.06] shadow-[0_28px_60px_-24px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-start gap-[55px] px-12 py-10">
                <span className="text-[16px] font-semibold text-[#0b0b0c] whitespace-nowrap tracking-[-0.3px] pt-1">
                  Dash Cameras
                </span>
                <div className="flex gap-[21px]">
                  {dropdownProducts.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      role="menuitem"
                      onClick={() => setProductsOpen(false)}
                      className="group block w-[199px] rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--finevu-orange)] focus-visible:ring-offset-4"
                    >
                      <div className="relative aspect-[199/236] rounded-[20px] overflow-hidden bg-gradient-to-b from-zinc-100 to-zinc-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span
                          className={`absolute top-[10px] left-[10px] inline-flex items-center h-[15px] px-2.5 rounded-full text-[8px] font-semibold uppercase tracking-[0.24px] leading-none text-white ${p.badgeClass}`}
                        >
                          {p.badge}
                        </span>
                      </div>
                      <h4 className="mt-3 text-[17px] font-bold text-[#18181b] group-hover:text-[var(--finevu-orange)] transition-colors">
                        {p.name}
                      </h4>
                      <p className="mt-1 text-[11px] text-[#9f9fa9] whitespace-nowrap">{p.subtitle}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className={`xl:hidden max-w-[1400px] mt-2 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/15 overflow-hidden ${
                subNav ? "mx-4 md:mx-8" : "mx-auto"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="px-6 py-6 space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  Dash Cameras
                </p>
                {productsItem?.children?.map((c) => (
                  <Link key={c.href} href={c.href} className="block pl-3 text-white/80 hover:text-white transition-colors">
                    {c.label}
                  </Link>
                ))}
                <div className="pt-2 space-y-4">
                  {flatLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="block text-white/80 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
                <Link href={primaryCta.href} className="block pt-2">
                  <button
                    className="cta-hover w-full text-white font-semibold text-[14px] uppercase leading-[20px] px-6 py-3.5 rounded-full"
                    style={{ backgroundColor: CTA_ORANGE }}
                  >
                    {primaryCta.label}
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
