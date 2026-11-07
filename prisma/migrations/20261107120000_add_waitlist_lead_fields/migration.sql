-- Lead qualification and attribution for the waitlist. All columns are
-- nullable, so code from before this migration keeps working against it.
ALTER TABLE "WaitlistEntry"
  ADD COLUMN "role" TEXT,
  ADD COLUMN "experience" TEXT,
  ADD COLUMN "payer" TEXT,
  ADD COLUMN "score" INTEGER,
  ADD COLUMN "tier" TEXT,
  ADD COLUMN "utmSource" TEXT,
  ADD COLUMN "utmMedium" TEXT,
  ADD COLUMN "utmCampaign" TEXT,
  ADD COLUMN "referrer" TEXT,
  ADD COLUMN "landingPath" TEXT;

CREATE INDEX "WaitlistEntry_cohort_tier_idx" ON "WaitlistEntry"("cohort", "tier");
