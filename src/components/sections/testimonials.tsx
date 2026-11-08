import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { getApprovedTestimonials } from "@/lib/testimonials-server";

const HOMEPAGE_LIMIT = 6;

/** Approved learner testimonials; renders nothing until at least one is approved. */
export async function Testimonials() {
  const testimonials = await getApprovedTestimonials({
    featuredFirst: true,
    limit: HOMEPAGE_LIMIT,
  });
  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-surface py-16 sm:py-24 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            What Learners Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            In their own words, verified through Google or LinkedIn sign-in. Nothing is written on
            anyone&apos;s behalf.
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((t, index) => (
            <FadeIn key={t.id} delay={index * 0.08}>
              <TestimonialCard testimonial={t} />
            </FadeIn>
          ))}
        </div>

        <p className="mt-10 text-center">
          <Link href="/testimonials" className="font-medium text-primary-light hover:underline">
            Read all testimonials →
          </Link>
        </p>
      </div>
    </section>
  );
}
