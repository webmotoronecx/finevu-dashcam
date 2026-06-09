"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
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

  const { nav, primaryCta, logo } = siteConfig;

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
            <Link href="/" aria-label={logo.alt}>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={32}
                  className={`${logo.heightClass} w-auto`}
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`smooth-transition hover:text-[var(--brand-primary)] text-white/90 drop-shadow-sm font-medium ${
                    pathname === link.href ? "text-[var(--brand-primary)]" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href={primaryCta.href}>
                <motion.button
                  className="px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-white smooth-transition electric-glow font-medium"
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
                {nav.map((link) => (
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
                ))}
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
