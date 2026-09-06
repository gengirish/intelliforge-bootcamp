import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE_CONFIG, SPRINT_CONFIG } from "@/lib/constants";
import { SHORT_DISCLAIMER } from "@/lib/ccarf/blueprint";

/**
 * The `/claude` hub runs its own chrome. The site header's nav is landing-page hash
 * anchors, which do not resolve off the home page, so these routes use the same
 * back-link + CTA bar as `/research`.
 */
export default function ClaudeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/claude"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary-light"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            CCAR-F Prep
          </Link>
          <Link
            href={SPRINT_CONFIG.href}
            className="rounded-lg bg-cta px-3 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-cta-hover sm:text-sm"
          >
            Join the AI Sprint
          </Link>
        </div>
      </div>

      {children}

      <footer className="mt-20 border-t border-border">
        <div className="mx-auto max-w-5xl space-y-3 px-4 py-10 text-xs text-muted sm:px-6">
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/claude" className="hover:text-foreground">
              CCAR-F hub
            </Link>
            <Link href="/claude/quiz" className="hover:text-foreground">
              Mock exam
            </Link>
            <Link href="/claude/review" className="hover:text-foreground">
              Learn &amp; Review
            </Link>
            <Link href="/claude/foundations" className="hover:text-foreground">
              Exam guide
            </Link>
            <Link href="/" className="hover:text-foreground">
              Bootcamp
            </Link>
          </nav>
          <p>{SHORT_DISCLAIMER}</p>
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Claude and Claude Certified
            Architect are trademarks of Anthropic, referenced here for identification only.
          </p>
        </div>
      </footer>
    </>
  );
}
