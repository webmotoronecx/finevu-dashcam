"use client";

import { Menu, X, ChevronDown } from "lucide-react";
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

  // Sample the section under the navbar to theme the logo + mobile button.
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

  const { nav } = siteConfig;
  const productsItem = nav.find((n) => n.children);
  const flatLinks = nav.filter((n) => !n.children);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-full px-6 md:px-8 lg:px-16 py-5 md:py-7">
          <div className="grid grid-cols-3 items-center">
            {/* Logo — left */}
            <Link href="/" aria-label="FineVu home" className="flex items-center justify-self-start">
              <Logo
                variant={isDarkBackground ? "white" : "primary"}
                className="h-9 md:h-11 transition-transform duration-300 hover:scale-105"
              />
            </Link>

            {/* Centered floating pill — glows purple on hover */}
            <div
              className="hidden md:flex items-center gap-9 px-9 py-3.5 rounded-full backdrop-blur-md justify-self-center btn-glow-purple"
              style={{ background: "rgba(0,0,0,0.95)" }}
            >
              {productsItem && (
                <button
                  onClick={() => setProductsOpen((v) => !v)}
                  className="text-base text-white/90 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
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
                    className={`text-base font-medium transition-colors ${
                      active ? "text-white font-semibold" : "text-white/90 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right — mobile menu button (keeps the pill centred on desktop) */}
            <div className="flex md:hidden justify-self-end col-start-3">
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className={isDarkBackground ? "text-white" : "text-zinc-900"}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden mx-6 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/15 overflow-hidden"
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
