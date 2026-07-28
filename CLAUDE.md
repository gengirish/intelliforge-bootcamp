# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Next.js dev server (Turbopack) on :3000
npm run build            # prisma generate && next build
npm run lint             # eslint (flat config, next/core-web-vitals + next/typescript)

npm run test:e2e         # Playwright — boots its own dev server on :3100
npm run test:e2e:ui      # Playwright UI mode
npx playwright test tests/e2e/sprint.spec.ts            # single file
npx playwright test -g "rejects invalid plan"           # single test by name

npm run db:migrate       # prisma migrate dev   (all db:* load .env.local via dotenv-cli)
npm run db:deploy        # prisma migrate deploy
npm run db:seed          # seeds the active Sprint row (prisma/seed.ts)
```

Env vars live in `.env.local` (not `.env`) — every `db:*` script and the Playwright config read that file explicitly. `.env.example` only documents the WhatsApp/OTP block; the full set also includes `DATABASE_URL`, `DIRECT_URL`, Clerk keys, `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `NEXT_PUBLIC_RAZORPAY_KEY_ID` / `RAZORPAY_WEBHOOK_SECRET`, `LMS_API_URL` / `LMS_API_KEY`, `AGENTMAIL_API_KEY` / `AGENTMAIL_INBOX` / `ADMIN_NOTIFY_EMAIL`, `ADMIN_SECRET`, `CRON_SECRET`.

Deployed on **Vercel** at `https://upskill.intelliforge.tech`, from the project named **`learning-bootcamp`** (not `intelliforge-bootcamp`). There is no `vercel.json`/`.vercel` in the repo — the project is linked on Vercel's side, so deploy config and env vars change in the dashboard, not here. Pushing to `master` deploys production.

Tests that need a real dependency are skipped rather than failed when it is absent — `DATABASE_URL` for anything asserting the live-cohort sprint UI or the seats API, `AGENTMAIL_API_KEY` for the email round-trips. With no `.env.local` the suite is 98 passed / 11 skipped; a seeded DB turns the skips into real coverage. `tests/e2e/helpers/env-local.ts` reads `.env.local` the way `playwright.config.ts` does, because test workers do not inherit the webServer env.

## Architecture

Next.js 16 App Router marketing + enrolment site for the IntelliForge AI Bootcamp. Two products (12-week **bootcamp**, 2-week **sprint**) share one payment/fulfilment spine.

### Enrolment → payment → fulfilment

1. `POST /sprint/enroll` (or `/bootcamp/enroll`) — Clerk-authenticated, validates seats, creates a Razorpay order plus a `PENDING` enrollment row keyed by `razorpayOrderId`.
2. Razorpay checkout runs client-side in `Sprint/BootcampCheckoutButtonClerk`.
3. Payment is confirmed by **two independent paths** that must stay idempotent:
   - webhook `POST /sprint/webhook` (and `/api/webhooks/razorpay`) → `src/lib/razorpay-webhook.ts`, HMAC-verified against `RAZORPAY_WEBHOOK_SECRET`, dispatches on `order_id` to the sprint or bootcamp table;
   - client fallback `POST /api/sprint/confirm-payment` → `confirmSprintPayment()`, which verifies the `order|payment` signature or re-fetches the payment from Razorpay.
   Both funnel into `markSprintEnrollmentPaid()` in [src/lib/sprint-payment.ts](src/lib/sprint-payment.ts), which short-circuits when `status === "PAID"`. Preserve that guard when editing.
4. `fulfillSprintEnrollment()` then does the side effects: LMS enrolment → confirmation email → WhatsApp opt-in. Each is best-effort — LMS failures are persisted to `lmsEnrollmentError` (retryable via `POST /api/admin/retry-lms-enrollments`), email and WhatsApp failures are logged and swallowed so they never roll back a paid enrolment.

`markSprintEnrollmentPaidManually()` is the same path for offline/UPI payments, invoked by `POST /api/admin/mark-sprint-paid` or `scripts/mark-sprint-manual-paid.ts`.

### Seat counts have two sources of truth

`getSprintSeatCounts()` reads the real DB count (and self-heals `Sprint.seatsFilled` when it drifts), but everything user-facing runs through `resolveSprintDisplaySeats()`, which overrides `filled` with the length of `SPRINT_CONFIG.bookedSeatNames` in [src/lib/constants.ts](src/lib/constants.ts). Editing that array changes what the landing page, seat map, and the enrol route's "no seats remaining" check all report. Update it whenever a manual booking is recorded.

### External services

The app holds no Meta or OTP secrets of its own; it is a tenant (`WHATSAPP_TENANT_ID`, default `bootcamp`) of two hosted services on Fly.io, each reached through a thin bearer-auth client:

- [src/lib/whatsapp-hub.ts](src/lib/whatsapp-hub.ts) — opt-in and template sends against the central hub; `/api/whatsapp/inbound` receives forwarded messages and rejects tenant mismatches.
- [src/lib/otp.ts](src/lib/otp.ts) + [src/lib/otp-clerk.ts](src/lib/otp-clerk.ts) — WhatsApp OTP login. `/api/auth/otp/request` sends the code; `/api/auth/otp/verify` verifies it, then `mintClerkSignInToken()` returns a 60s sign-in token the client redeems via Clerk's `strategy: "ticket"`. The Clerk user is keyed by a **derived email** (`<digits>@phone.intelliforge.tech`) with the real number in `publicMetadata.phone` — not by phone number, because Clerk has `phone_number` disabled as an attribute *and* rejects Indian numbers outright ("Phone numbers from this country (India) are currently not supported"). It also passes `skipPasswordRequirement`, since the instance marks password required. Possession is proven by the OTP service, so Clerk only mints the session. Note production currently runs a Clerk **development** instance (`pk_test_`, `picked-jay-18.clerk.accounts.dev`).
- [src/lib/lms-client.ts](src/lib/lms-client.ts) — course enrolment on learning.intelliforge.tech, 3 attempts with backoff, retrying only 5xx.
- [src/lib/email.ts](src/lib/email.ts) — transactional email via AgentMail.

Both clients expose an `isXConfigured()` guard and return null config rather than throwing at import time, so the app boots with these unset — check the guard before calling.

`src/lib/product-catalog.ts` maps product slugs to LMS course slugs and plan prices in paise; the sprint slug `ai-sprint-jun-2026` is duplicated in `SPRINT_CONFIG`, the seed, and route defaults — change all of them together.

### Auth boundaries

Clerk middleware only matches `/sign-in`, `/sprint/enroll`, `/bootcamp/enroll` ([src/middleware.ts](src/middleware.ts)); everything else is public. Admin routes are not Clerk-guarded — they check a bearer token against `ADMIN_SECRET` (`CRON_SECRET` for the retry job) inside each handler.

### E2E bypass

Playwright can't drive Clerk, so tests run the dev server with `E2E_BYPASS_CLERK=1` / `NEXT_PUBLIC_E2E_BYPASS=1`. That flag swaps the middleware for a pass-through, makes server routes skip `auth()`/`currentUser()`, and picks the `*Stub` variant in the `X` / `XClerk` / `XStub` checkout-button triple (`SprintCheckoutButton.tsx` is just the selector). When adding a Clerk-dependent component, follow that three-file pattern or the suite will hang on Clerk's UI.

### Content

Marketing copy, pricing, curriculum, FAQs, testimonials, and cohort dates are centralised as exported constants in [src/lib/constants.ts](src/lib/constants.ts) rather than inlined in components — copy changes belong there. Note that prices appear both as display strings there and as paise integers in `product-catalog.ts` / the seed.

`/zoom`, `/whatsapp`, and `/sprint/whatsapp` are server redirect routes to external invite URLs, so the links can be changed in one place; `tests/e2e/redirects.spec.ts` asserts them.
