"use client";

import { Menu, X, ChevronDown, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { Logo } from "@/components/Logo";

// Featured products shown in the centered mega-menu dropdown.
const dropdownProducts = [
  {
    href: "/gx4k",
    name: "GX4K Dash Cam",
    variant: "4K UHD Dual Channel",
    image: "/products/gx4k-studio.jpg",
  },
  {
    href: "/gx35",
    name: "GX35 Dash Cam",
    variant: "2K QHD Dual Channel",
    image: "/products/gx35-hero.jpg",
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

  // Glass pill — translucent light glass per Figma (node 14:1409) over dark
  // sections; a light-tinted glass keeps it legible over white sections.
  const pillStyle = isDarkBackground
    ? {
        background: "rgba(217, 217, 217, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
      }
    : {
        background: "rgba(255, 255, 255, 0.7)",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
      };

  const linkBase = isDarkBackground ? "text-white/80 hover:text-white" : "text-zinc-600 hover:text-zinc-950";
  const linkActive = isDarkBackground ? "text-white" : "text-zinc-950";
  const iconColor = isDarkBackground ? "text-white/80 hover:text-white" : "text-zinc-600 hover:text-zinc-950";

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Floating glass pill — compact, content-width, centred. Glows on hover. */}
        <div
          className="w-full md:w-fit mx-auto mt-4 md:mt-6 pl-5 md:pl-8 pr-3 py-2.5 rounded-full btn-glow-purple flex items-center justify-between md:justify-start gap-5 md:gap-10 lg:gap-12"
          style={pillStyle}
        >
          {/* Logo — left (orange/grey wordmark) */}
          <Link href="/" aria-label="FineVu home" className="flex items-center shrink-0">
            <Logo variant="primary" className="h-7 md:h-8 transition-transform duration-300 hover:scale-105" />
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-7 lg:gap-8">
            {productsItem && (
              <button
                onClick={() => setProductsOpen((v) => !v)}
                className={`text-[15px] transition-colors flex items-center gap-1.5 font-medium ${linkBase}`}
                aria-haspopup="true"
                aria-expanded={productsOpen}
              >
                {productsItem.label}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`}
                />
              </button>
            )}
            {flatLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[15px] font-medium transition-colors ${active ? linkActive + " font-semibold" : linkBase}`}
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

      {/* Products mega-menu dropdown */}
      <AnimatePresence>
        {productsOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setProductsOpen(false)} />
            <motion.div
              className="fixed left-1/2 -translate-x-1/2 top-24 z-50 w-full max-w-2xl px-4"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8">
                <div className="grid grid-cols-2 gap-8">
                  {dropdownProducts.map((product) => (
                    <Link
                      key={product.href}
                      href={product.href}
                      onClick={() => setProductsOpen(false)}
                      className="group flex flex-col items-center text-center"
                    >
                      <div className="w-full aspect-[4/3] bg-black rounded-lg mb-4 overflow-hidden flex items-center justify-center p-6 border border-white/5 group-hover:border-white/20 transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1">{product.name}</h4>
                      <p className="text-sm text-gray-400">{product.variant}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
