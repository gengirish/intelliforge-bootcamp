-- Referrals ("Share your spot") and the post-submit motivation question.
-- Motivation is now asked after signup, so it can be missing. Additive only:
-- code from before this migration keeps working against it.
ALTER TABLE "WaitlistEntry"
  ALTER COLUMN "motivation" DROP NOT NULL,
  ADD COLUMN "referralCode" TEXT,
  ADD COLUMN "referredBy" TEXT;

CREATE UNIQUE INDEX "WaitlistEntry_referralCode_key" ON "WaitlistEntry"("referralCode");
CREATE INDEX "WaitlistEntry_referredBy_idx" ON "WaitlistEntry"("referredBy");
