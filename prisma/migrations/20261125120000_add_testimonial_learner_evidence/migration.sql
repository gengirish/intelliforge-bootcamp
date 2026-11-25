-- Records how a testimonial's "Verified learner" badge was earned, so learners
-- who paid off-platform (UPI, bank transfer) can be verified by an admin with a
-- private audit note. Additive only: code from before this migration keeps
-- working against it.
CREATE TYPE "LearnerVerification" AS ENUM ('ENROLMENT', 'PAYMENT_RECORD');

ALTER TABLE "Testimonial"
  ADD COLUMN "learnerVerifiedVia" "LearnerVerification",
  ADD COLUMN "learnerEvidence" TEXT,
  ADD COLUMN "learnerVerifiedAt" TIMESTAMP(3);

-- Every badge granted so far came from the automatic enrolment match.
UPDATE "Testimonial"
SET "learnerVerifiedVia" = 'ENROLMENT', "learnerVerifiedAt" = "createdAt"
WHERE "verifiedLearner" = true;
