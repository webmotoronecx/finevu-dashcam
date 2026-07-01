"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { Logo } from "@/components/Logo";

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
  useEffect(() => {
    const handleScroll = () => {
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change.
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  const { nav, primaryCta } = siteConfig;
  const productsItem = nav.find((n) => n.children);
  const flatLinks = nav.filter((n) => !n.children);

  // Translucent glass pill, themed to the section under the navbar.
  const glassStyle = isDarkBackground
    ? {
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
      }
    : {
        background: "rgba(255, 255, 255, 0.72)",
        border: "1px solid rgba(0, 0, 0, 0.06)",
      };
  const pillStyle = {
    ...glassStyle,
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
    transition: "background 250ms ease, border-color 250ms ease",
  };

  const lBase = isDarkBackground
    ? "text-white/85 hover:text-white"
    : "text-zinc-600 hover:text-zinc-950";
  const lActive = isDarkBackground ? "text-white" : "text-zinc-950";

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
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Row: centered glass pill (logo + links) with the Find Retailer button
            floating to the right — per Figma v4 (pill 113:3561, button 113:3356). */}
        {/* xl:pr reserves a gutter on the right so the centered pill can never
            slide under the absolutely-positioned Find Retailer button. */}
        <div className="relative z-50 mx-auto mt-4 md:mt-6 max-w-[1400px] flex items-center justify-center xl:pr-[210px]">
          {/* Centered pill */}
          <div
            className="relative z-10 flex w-full xl:w-auto items-center justify-between xl:justify-center gap-4 xl:gap-24 rounded-full px-5 py-2.5 xl:px-10 xl:py-3"
            style={pillStyle}
          >
            {/* Logo — orange/grey wordmark */}
            <Link href="/" aria-label="FineVu home" className="flex items-center shrink-0">
              <Logo variant="primary" className="w-[170px] h-[41px] object-contain transition-transform duration-300 hover:scale-105" />
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

          {/* Find Retailer — solid orange, floating to the right of the pill */}
          <Link
            href={primaryCta.href}
            className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--finevu-orange)] focus-visible:ring-offset-2"
          >
            <motion.button
              className="cta-hover text-white font-semibold text-[14px] uppercase tracking-[0.06em] px-9 py-4 rounded-full"
              style={{ backgroundColor: CTA_ORANGE }}
            >
              {primaryCta.label}
            </motion.button>
          </Link>
        </div>

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
              className="xl:hidden max-w-[1400px] mx-auto mt-2 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/15 overflow-hidden"
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
                    className="cta-hover w-full text-white font-semibold text-[13px] uppercase tracking-wider px-6 py-3.5 rounded-full"
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
