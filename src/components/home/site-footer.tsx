import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

const link = "hover:text-foreground";

/** One quiet row of links. Never link the paid class routes (/zoom, /whatsapp) from here. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-12 text-sm text-muted sm:px-8">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/sprint/all" className={link}>
            Sprints
          </Link>
          <Link href="/testimonials" className={link}>
            Testimonials
          </Link>
          <a href={SITE_CONFIG.share} target="_blank" rel="noopener noreferrer" className={link}>
            Graduate wins
          </a>
          <Link href="/claude" className={link}>
            CCAR-F prep
          </Link>
          <a href={SITE_CONFIG.lms} target="_blank" rel="noopener noreferrer" className={link}>
            Learning Platform
          </a>
          <Link href="/contact" className={link}>
            Contact
          </Link>
        </nav>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <span>© 2026 IntelliForge AI</span>
          <a href={`mailto:${SITE_CONFIG.contact.email}`} className={link}>
            {SITE_CONFIG.contact.email}
          </a>
          <a href={SITE_CONFIG.mainSite} target="_blank" rel="noopener noreferrer" className={link}>
            IntelliForge AI main site
          </a>
          <Link href="/privacy" className={link}>
            Privacy
          </Link>
          <Link href="/terms" className={link}>
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
