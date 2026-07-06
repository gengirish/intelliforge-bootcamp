"use client";

import Link from "next/link";
import { ArrowUp, ExternalLink } from "lucide-react";
import {
  FREE_LIVE_DEMO_URL,
  NAV_LINKS,
  SITE_CONFIG,
  SPRINT_CONFIG,
  WHATSAPP_GROUP_URL,
  ZOOM_URL,
} from "@/lib/constants";
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
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-foreground sm:text-2xl focus:outline-none focus:ring-2 focus:ring-accent rounded"
            >
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-3 max-w-md text-sm text-muted">
              Ship to a live repo. Get mentor-scored. Leave with a verifiable
              credential — from Hyderabad, India.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={FREE_LIVE_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-light px-3 py-1.5 text-xs text-accent hover:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Free demo
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
              <Link
                href={SPRINT_CONFIG.href}
                className="inline-flex items-center rounded-full border border-cta/30 bg-cta/10 px-3 py-1.5 text-xs font-medium text-cta hover:border-cta/50 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {SPRINT_CONFIG.ctaLabelShort}
              </Link>
              <a
                href={SITE_CONFIG.share}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-light px-3 py-1.5 text-xs text-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Graduate wins
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </div>
          </div>

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
                      className="inline-block text-sm text-muted transition-all duration-200 hover:translate-x-0.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="inline-block transition-all duration-200 hover:translate-x-0.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-all duration-200 hover:translate-x-0.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded"
                >
                  {SITE_CONFIG.contact.phone}
                </a>
              </li>
              <li>{SITE_CONFIG.contact.location}</li>
              <li className="pt-2">
                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-all duration-200 hover:translate-x-0.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded"
                >
                  Join WhatsApp Group
                </a>
              </li>
              <li>
                <a
                  href={ZOOM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-all duration-200 hover:translate-x-0.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded"
                >
                  Live Zoom Session
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.lms}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-all duration-200 hover:translate-x-0.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded"
                >
                  Learning Platform
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.certs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-all duration-200 hover:translate-x-0.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded"
                >
                  Verify Credentials
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.mainSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-all duration-200 hover:translate-x-0.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded"
                >
                  IntelliForge AI (Main)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            © 2026 IntelliForge AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/terms"
              className="inline-block text-muted transition-all duration-200 hover:translate-x-0.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="inline-block text-muted transition-all duration-200 hover:translate-x-0.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded"
            >
              Privacy
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 text-muted transition-all duration-200 hover:translate-x-0.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded"
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
