-- Learner-submitted testimonials, verified by the Google or LinkedIn account
-- the learner signed in with and reviewed by an admin before publishing.
CREATE TYPE "TestimonialStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "TestimonialMedia" AS ENUM ('NONE', 'AUDIO', 'VIDEO');

CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "status" "TestimonialStatus" NOT NULL DEFAULT 'PENDING',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "provider" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "email" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "quote" TEXT NOT NULL,
    "mediaKind" "TestimonialMedia" NOT NULL DEFAULT 'NONE',
    "mediaUrl" TEXT,
    "mediaPathname" TEXT,
    "mediaContentType" TEXT,
    "transcript" TEXT,
    "verifiedLearner" BOOLEAN NOT NULL DEFAULT false,
    "learnerSprints" TEXT,
    "consentVersion" TEXT NOT NULL,
    "consentedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Testimonial_clerkUserId_key" ON "Testimonial"("clerkUserId");
CREATE INDEX "Testimonial_status_featured_idx" ON "Testimonial"("status", "featured");
