"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE_CONFIG, WHATSAPP_DEMO_URL } from "@/lib/constants";

const HASH_SECTION_IDS = NAV_LINKS.filter((link) => link.href.startsWith("#")).map(
  (link) => link.href.slice(1)
);

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const visibleSections = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        const active = HASH_SECTION_IDS.find((id) => visibleSections.has(id));
        setActiveSection(active ?? null);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );

    HASH_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const getLinkClassName = (href: string, isMobile = false) => {
    const sectionId = href.startsWith("#") ? href.slice(1) : null;
    const isActive = sectionId !== null && activeSection === sectionId;

    return cn(
      "cursor-pointer transition-colors duration-200",
      isMobile ? "py-3" : "text-sm",
      isActive
        ? "font-medium text-foreground"
        : "text-muted hover:text-foreground"
    );
  };

  return (
    <header
      className={cn(
        "relative w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground hover:opacity-90 transition-opacity"
        >
          <span className="gradient-text">{SITE_CONFIG.name}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={getLinkClassName(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href={WHATSAPP_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-cta inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-cta px-4 py-2 text-sm font-medium text-background transition-transform duration-200 hover:scale-105 hover:bg-cta-hover"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Book Free Demo
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className="cursor-pointer p-2 text-foreground transition-colors duration-200 hover:text-accent md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Slide-down Nav */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-out",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 border-t border-border bg-background/95 backdrop-blur-md px-4 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={getLinkClassName(link.href, true)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={WHATSAPP_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-cta px-4 py-3 text-sm font-medium text-background hover:bg-cta-hover transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Book Free Demo
          </a>
        </nav>
      </div>
    </header>
  );
}
