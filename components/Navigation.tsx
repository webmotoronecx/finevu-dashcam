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
  const pathname = usePathname();

  // Close menus on route change.
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  const { nav, primaryCta } = siteConfig;
  const productsItem = nav.find((n) => n.children);
  const flatLinks = nav.filter((n) => !n.children);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Single floating pill — dark glass, glows purple on hover */}
        <div
          className="max-w-[1400px] mx-auto mt-4 md:mt-6 pl-5 md:pl-7 pr-3 md:pr-3 py-2.5 rounded-full btn-glow-purple flex items-center justify-between gap-4"
          style={{
            background: "rgba(10, 10, 11, 0.72)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Logo — left (orange/grey wordmark) */}
          <Link href="/" aria-label="FineVu home" className="flex items-center shrink-0">
            <Logo variant="primary" className="h-7 md:h-8 transition-transform duration-300 hover:scale-105" />
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-9">
            {productsItem && (
              <button
                onClick={() => setProductsOpen((v) => !v)}
                className="text-[15px] text-white/90 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
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
                  className={`text-[15px] font-medium transition-colors ${
                    active ? "text-white font-semibold" : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right — search + Find Retailer */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link
              href="/support"
              aria-label="Search"
              className="text-white/90 hover:text-white transition-colors"
            >
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
            className="md:hidden text-white shrink-0 pr-1"
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
