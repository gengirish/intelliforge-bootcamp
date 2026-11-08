import type { Metadata } from "next";
import Link from "next/link";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { getApprovedTestimonials } from "@/lib/testimonials-server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Learner testimonials · IntelliForge AI Bootcamp",
  description:
    "What working professionals say about the IntelliForge AI Bootcamp, in their own words, verified through Google or LinkedIn sign-in.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const testimonials = await getApprovedTestimonials({ featuredFirst: true });

  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← IntelliForge AI Bootcamp
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          What learners say
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted">
          Every testimonial here was submitted by the learner after signing in with Google or
          LinkedIn, which is where the name and photo come from. &ldquo;Verified learner&rdquo; means
          it matches a paid enrolment. Nothing is written on anyone&apos;s behalf.
        </p>

        {testimonials.length === 0 ? (
          <p className="mt-12 text-muted">The first testimonials are being reviewed. Check back soon.</p>
        ) : (
          <div className="mt-12 columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        )}

        <p className="mt-12 text-sm text-muted">
          Took the bootcamp?{" "}
          <Link href="/testimonials/submit" className="text-primary-light hover:underline">
            Share your testimonial
          </Link>
        </p>
      </div>
    </main>
  );
}
