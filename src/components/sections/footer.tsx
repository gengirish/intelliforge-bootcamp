"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Footer() {
  return (
    <footer
      className="border-t border-border bg-surface"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Brand & tagline */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
            >
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-3 max-w-md text-sm text-muted">
              Enabling the next generation of AI builders — enterprise-grade
              bootcamps from Hyderabad, India.
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center rounded-full border border-border bg-surface-light px-3 py-1.5 text-xs text-muted">
                Aligned with Bharat AI Mission
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <nav className="mt-4" aria-label="Footer navigation">
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="transition-colors hover:text-foreground"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  {SITE_CONFIG.contact.phone}
                </a>
              </li>
              <li>{SITE_CONFIG.contact.location}</li>
              <li className="pt-2">
                <a
                  href={SITE_CONFIG.lms}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Learning Platform
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.mainSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  IntelliForge AI (Main)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            © 2026 IntelliForge AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/terms"
              className="text-muted transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-muted transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className={cn(
                "inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
              )}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" aria-hidden />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
