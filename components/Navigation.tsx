"use client";

import { Menu, X, ChevronDown, Search } from "lucide-react";
import { useState, useEffect } from "react";
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
    image: "/products/gx4k-studio.jpg",
    badge: "4K UHD",
    badgeClass: "bg-[var(--finevu-orange)]",
  },
  {
    href: "/gx35",
    name: "GX35",
    subtitle: "Premium 2K Camera · Front & Rear",
    image: "/products/gx35-hero.jpg",
    badge: "2K · Best Value",
    badgeClass: "bg-zinc-900",
  },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const pathname = usePathname();

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

  // When the Products panel is open the pill becomes a solid white panel with
  // dark text; otherwise it is the translucent glass pill (themed per section).
  const glassStyle = isDarkBackground
    ? {
        background: "rgba(217, 217, 217, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }
    : {
        background: "rgba(255, 255, 255, 0.7)",
        border: "1px solid rgba(0, 0, 0, 0.06)",
      };

  const pillStyle = productsOpen
    ? {
        background: "#ffffff",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        boxShadow: "0 28px 60px -24px rgba(0,0,0,0.35)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        transition: "background 250ms ease, box-shadow 250ms ease, border-color 250ms ease",
      }
    : {
        ...glassStyle,
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        transition: "background 250ms ease, box-shadow 250ms ease, border-color 250ms ease",
      };

  const lBase = productsOpen
    ? "text-zinc-700 hover:text-zinc-950"
    : isDarkBackground
      ? "text-white/80 hover:text-white"
      : "text-zinc-600 hover:text-zinc-950";
  const lActive = productsOpen || !isDarkBackground ? "text-zinc-950" : "text-white";
  const iconColor = productsOpen
    ? "text-zinc-700 hover:text-zinc-950"
    : isDarkBackground
      ? "text-white/80 hover:text-white"
      : "text-zinc-600 hover:text-zinc-950";

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
        {/* Floating pill — morphs into a white panel when Products is open */}
        <div
          className={`w-full md:w-fit mx-auto mt-4 md:mt-6 rounded-[2.5rem] flex flex-col ${productsOpen ? "" : "btn-glow-purple"}`}
          style={pillStyle}
        >
          {/* Nav row */}
          <div className="flex items-center w-full justify-between md:justify-start gap-5 md:gap-10 lg:gap-12 pl-5 md:pl-8 pr-3 py-2.5">
            {/* Logo — left (orange/grey wordmark) */}
            <Link href="/" aria-label="FineVu home" className="flex items-center shrink-0">
              <Logo variant="primary" className="h-7 md:h-8 transition-transform duration-300 hover:scale-105" />
            </Link>

            {/* Center links */}
            <div className="hidden md:flex items-center gap-7 lg:gap-8">
              {productsItem && (
                <button
                  onClick={() => setProductsOpen((v) => !v)}
                  className={`relative text-[15px] transition-colors flex items-center gap-1.5 font-medium ${
                    productsOpen ? "text-[var(--finevu-orange)]" : lBase
                  }`}
                  aria-haspopup="true"
                  aria-expanded={productsOpen}
                >
                  {productsItem.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`}
                  />
                  {productsOpen && (
                    <span className="absolute -bottom-2 left-0 h-[2px] w-[72px] bg-[var(--finevu-orange)] rounded-full" />
                  )}
                </button>
              )}
              {flatLinks.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[15px] font-medium transition-colors ${active ? lActive + " font-semibold" : lBase}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right — search + Find Retailer */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <Link href="/support" aria-label="Search" className={`transition-colors ${iconColor}`}>
                <Search className="w-5 h-5" />
              </Link>
              <Link href={primaryCta.href}>
                <motion.button
                  className="brand-gradient-soft btn-glow-purple text-white font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {primaryCta.label}
                </motion.button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className={`md:hidden shrink-0 pr-1 ${isDarkBackground ? "text-white" : "text-zinc-900"}`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Products mega-menu panel — expands inside the pill */}
          <AnimatePresence initial={false}>
            {productsOpen && (
              <motion.div
                key="products-panel"
                className="hidden md:block overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-start gap-10 lg:gap-14 pl-[20%] pr-10 pt-5 pb-9">
                  <span className="text-[15px] font-semibold text-zinc-900 whitespace-nowrap pt-2 tracking-wide">
                    Dash Cameras
                  </span>
                  <div className="flex gap-5 lg:gap-6">
                    {dropdownProducts.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={() => setProductsOpen(false)}
                        className="group block w-[152px] lg:w-[170px]"
                      >
                        <div className="relative aspect-[199/236] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-100 to-zinc-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt={p.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span
                            className={`absolute top-2.5 left-2.5 px-2.5 py-[3px] rounded-full text-[8px] font-semibold uppercase tracking-wider text-white ${p.badgeClass}`}
                          >
                            {p.badge}
                          </span>
                        </div>
                        <h4 className="mt-3 text-[16px] lg:text-[17px] font-bold text-zinc-900 group-hover:text-[var(--finevu-orange)] transition-colors">
                          {p.name}
                        </h4>
                        <p className="mt-1 text-[10px] lg:text-[11px] text-zinc-400 whitespace-nowrap">{p.subtitle}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden max-w-[1400px] mx-auto mt-2 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/15 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="px-6 py-6 space-y-4">
                {productsItem?.children?.map((c) => (
                  <Link key={c.href} href={c.href} className="block text-white/80 hover:text-white transition-colors">
                    {c.label}
                  </Link>
                ))}
                {flatLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block text-white/80 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
                <Link href={primaryCta.href} className="block pt-2">
                  <button className="w-full brand-gradient-soft text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full">
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
