"use client";

import { Menu, X, Search, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { Logo } from "@/components/Logo";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Find the topmost themed section under the navbar
      const x = window.innerWidth / 2;
      const y = 40;
      const elements = document.elementsFromPoint(x, y);

      for (const el of elements) {
        if (el.closest("nav")) continue;
        const section = el.closest("[data-nav-theme]");
        if (section) {
          const theme = section.getAttribute("data-nav-theme");
          setIsDarkBackground(theme === "dark");
          return;
        }
      }

      if (window.scrollY < 50) {
        setIsDarkBackground(true);
      } else {
        setIsDarkBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const { nav, primaryCta } = siteConfig;

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 font-sans"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="max-w-[1400px] mx-auto mt-4 md:mt-6 px-4 md:px-6 py-3 md:py-4 rounded-full transition-all duration-500 glass-blur shadow-lg"
          style={{
            background: isDarkBackground
              ? isScrolled
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.05)"
              : isScrolled
                ? "rgba(21, 21, 21, 0.75)"
                : "rgba(21, 21, 21, 0.65)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" aria-label="FineVu home">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Logo className="h-7 md:h-8" />
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-7 lg:gap-9">
              {nav.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={`flex items-center gap-1 smooth-transition hover:text-[var(--brand-primary)] text-white/90 drop-shadow-sm font-medium ${
                        link.children.some((c) => c.href === pathname)
                          ? "text-[var(--brand-primary)]"
                          : ""
                      }`}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === link.label}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-4"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div
                            className="min-w-[220px] rounded-2xl p-2 shadow-2xl border border-white/10"
                            style={{
                              background: "rgba(21, 21, 21, 0.9)",
                              backdropFilter: "blur(40px) saturate(180%)",
                              WebkitBackdropFilter: "blur(40px) saturate(180%)",
                            }}
                          >
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`block px-4 py-3 rounded-xl text-sm smooth-transition hover:bg-white/10 ${
                                  pathname === child.href
                                    ? "text-[var(--brand-primary)]"
                                    : "text-white/85"
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`smooth-transition hover:text-[var(--brand-primary)] text-white/90 drop-shadow-sm font-medium ${
                      pathname === link.href ? "text-[var(--brand-primary)]" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}

              <Link
                href="/support"
                aria-label="Search"
                className="text-white/90 hover:text-[var(--brand-primary)] smooth-transition drop-shadow-sm"
              >
                <Search className="w-5 h-5" />
              </Link>

              <Link href={primaryCta.href}>
                <motion.button
                  className="px-5 py-2.5 rounded-full brand-gradient text-white smooth-transition font-semibold text-sm uppercase tracking-wider shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  {primaryCta.label}
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 smooth-transition hover:scale-110 transition-colors duration-300 text-white drop-shadow-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="absolute top-24 left-4 right-4 glass-blur rounded-3xl p-8 shadow-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
              }}
            >
              <div className="flex flex-col gap-6">
                {nav.map((link) =>
                  link.children ? (
                    <div key={link.label} className="flex flex-col gap-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                        {link.label}
                      </span>
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`text-xl smooth-transition hover:text-[var(--brand-primary)] ${
                            pathname === child.href
                              ? "text-[var(--brand-primary)]"
                              : "text-zinc-900"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-xl smooth-transition hover:text-[var(--brand-primary)] ${
                        pathname === link.href
                          ? "text-[var(--brand-primary)]"
                          : "text-zinc-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <Link href={primaryCta.href} className="mt-4">
                  <button className="w-full px-6 py-4 rounded-full bg-[var(--brand-primary)] text-white smooth-transition electric-glow font-medium hover:scale-105 transition-transform">
                    {primaryCta.label}
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
