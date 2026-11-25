import Link from "next/link";
import { SentenceSignup } from "@/components/home/sentence-signup";
import { SiteFooter } from "@/components/home/site-footer";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import {
  COHORT_2,
  COHORT_2_SPRINTS,
  FAQ_ITEMS,
  FOUNDER,
  FREE_LIVE_DEMO_URL,
  HOME,
  SPRINT_CONFIG,
} from "@/lib/constants";
import { getApprovedTestimonials } from "@/lib/testimonials-server";

/** Approved testimonials come from the database; admin actions also revalidate on change. */
export const revalidate = 300;

/** The questions a working engineer asks before joining; the rest live on /sprint. */
const FAQ_SHOWN = [
  "What's the time commitment?",
  "Do I need prior AI/ML experience?",
  "How does the 12-week bootcamp relate to the sprints?",
  "What's the refund policy?",
];

const container = "mx-auto w-full max-w-3xl px-5 sm:px-8";
const sectionHeading = "text-sm font-medium uppercase tracking-[0.18em] text-muted";

export default async function Home() {
  const testimonials = await getApprovedTestimonials({ featuredFirst: true, limit: 3 });
  const faqs = FAQ_ITEMS.filter((f) => FAQ_SHOWN.includes(f.question));
  const open = SPRINT_CONFIG.enrollmentOpen;

  return (
    <>
      <header className={`${container} flex items-center justify-between pt-6`}>
        <Link href="/" className="text-sm font-semibold tracking-tight">
          IntelliForge AI Bootcamp
        </Link>
        <nav aria-label="Main" className="flex gap-5 text-sm text-muted">
          <a href="#curriculum" className="hover:text-foreground">
            Curriculum
          </a>
          <a href="#faq" className="hover:text-foreground">
            FAQ
          </a>
        </nav>
      </header>

      <main id="main-content">
        <section
          id="join"
          aria-labelledby="home-headline"
          className={`${container} flex min-h-[calc(100svh-4rem)] flex-col justify-center py-16`}
        >
          <p className="text-sm text-muted">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-cta align-middle" aria-hidden />
            {open ? (
              <>
                Enrolment is open.{" "}
                <Link href={SPRINT_CONFIG.ctaHref} className="text-foreground underline underline-offset-4">
                  Sprint 1 · {SPRINT_CONFIG.priceDisplay}
                </Link>
              </>
            ) : (
              `${COHORT_2.name} opens ${COHORT_2.launchWeekendShort} · first class ${COHORT_2.firstClassShort}`
            )}
          </p>
          <h1
            id="home-headline"
            className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
          >
            {HOME.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{HOME.subhead}</p>

          <div className="mt-14">
            <SentenceSignup enrollmentOpen={open} />
          </div>

          <p className="mt-12 text-sm text-muted">
            <a
              href={FREE_LIVE_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              {HOME.demoLine}
            </a>{" "}
            →
          </p>
        </section>

        <section id="curriculum" aria-labelledby="curriculum-heading" className={`${container} py-24`}>
          <h2 id="curriculum-heading" className={sectionHeading}>
            {HOME.shipsHeading}
          </h2>
          <ol className="mt-10 divide-y divide-border border-y border-border">
            {COHORT_2_SPRINTS.map((s) => (
              <li key={s.slug} className="grid gap-1 py-6 sm:grid-cols-[3rem_1fr_auto] sm:gap-6">
                <span className="font-mono text-sm text-muted">{String(s.number).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-medium">{s.title}</h3>
                  <p className="mt-1 text-muted">{s.ships}</p>
                </div>
                <span className="text-sm text-muted sm:text-right">{s.dates}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-muted">
            Live on Zoom, Saturday and Sunday, 7:30–10 AM IST. {SPRINT_CONFIG.priceDisplay} per sprint,
            paid one sprint at a time. Stop whenever you like.{" "}
            <Link href="/sprint/all" className="text-foreground underline underline-offset-4">
              See all six sprints
            </Link>
          </p>
        </section>

        {testimonials.length > 0 && (
          <section id="testimonials" aria-labelledby="testimonials-heading" className="border-t border-border py-24">
            <div className="mx-auto max-w-5xl px-5 sm:px-8">
              <h2 id="testimonials-heading" className={sectionHeading}>
                From learners in earlier sprints
              </h2>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t) => (
                  <TestimonialCard key={t.id} testimonial={t} />
                ))}
              </div>
              <p className="mt-8">
                <Link href="/testimonials" className="text-sm text-muted underline underline-offset-4 hover:text-foreground">
                  Read all testimonials
                </Link>
              </p>
            </div>
          </section>
        )}

        <section aria-labelledby="founder-heading" className={`${container} border-t border-border py-24`}>
          <h2 id="founder-heading" className={sectionHeading}>
            Who teaches it
          </h2>
          <p className="mt-8 text-2xl leading-snug tracking-tight">
            {FOUNDER.fullName}, {FOUNDER.title.toLowerCase()} at {FOUNDER.company}.
          </p>
          <p className="mt-4 text-muted">{FOUNDER.bio}</p>
        </section>

        <section id="faq" aria-labelledby="faq-heading" className={`${container} border-t border-border py-24`}>
          <h2 id="faq-heading" className={sectionHeading}>
            Questions
          </h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {faqs.map((f) => (
              <details key={f.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-medium [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span aria-hidden className="text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted">{f.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-16 text-xl tracking-tight">
            <a href="#join" className="underline decoration-cta underline-offset-8 hover:text-cta">
              Finish the sentence
            </a>{" "}
            <span className="text-muted">
              {open ? "and we'll email you the details." : `and we'll email you when ${COHORT_2.name} opens.`}
            </span>
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
