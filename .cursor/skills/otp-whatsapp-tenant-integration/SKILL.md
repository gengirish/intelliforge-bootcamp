---
name: otp-whatsapp-tenant-integration
description: >-
  Integrates a product app into the hosted IntelliForge OTP API and WhatsApp hub
  as a tenant — provisioning tenant keys, bearer/tenant clients, request/verify
  routes, minting the product's session after a verified OTP, inbound webhook
  forwarding, Fly and Vercel secret plumbing, and E2E patterns that never trigger
  real sends. Use when adding WhatsApp OTP login or WhatsApp messaging to a
  product (bootcamp, hrms, awaazos, forgeid, …), onboarding a new tenant, or
  debugging otp_not_configured, tenant_mismatch, clerk_mint_failed, Meta error
  100, template errors, undelivered codes, or bare 500s from /api/auth/otp/*.
---

# OTP / WhatsApp Tenant Integration

Product apps (bootcamp, hrms, awaazos, …) hold **no Meta or Gupshup credentials**
and do not run WhatsApp themselves. They hold a tenant API key and make
server-side calls to two Fly services. Delivery goes out from **one shared
WhatsApp business number** (the hub's WABA); `tenant_id` exists only for auth,
attribution and rate limits.

| Service | Host | Purpose |
|---|---|---|
| `intelliforge-otp-api` | `intelliforge-otp-api.fly.dev` | `POST /v1/otp/request`, `POST /v1/otp/verify`, `GET /v1/otp/status` |
| `intelliforge-whatsapp-hub` | `intelliforge-whatsapp-hub.fly.dev` | opt-in, template/text sends, inbound forwarding |

All `/v1/*` require `Authorization: Bearer <key>`. Reference implementation:
`apps/otp-demo/`. Client library `@intelliforge/otp-client` is a private
workspace package — separate repos call the API directly with `fetch`.

## Workflow

```
- [ ] 1. Provision a tenant key (both Fly secrets, same value)
- [ ] 2. Set the product's env IN ITS HOSTING PLATFORM, then redeploy
- [ ] 3. Add request + verify routes behind the product's own API
- [ ] 4. Mint the product's session on verify
- [ ] 5. Verify end-to-end with a real number
```

**One `if_live_` key serves both.** `OTP_API_KEYS` (otp-api) and `WHATSAPP_API_KEYS` (hub)
hold the same value — confirm with `fly secrets list`: identical digests mean identical
values. Format is comma-separated `tenant:key` pairs:

```
bootcamp:if_live_xxx,awaazos:if_live_yyy
```

The server maps key → tenant (`tenantForApiKey`). The client sends both:

```
Authorization: Bearer if_live_xxx
X-Tenant-Id: bootcamp
```

## Onboarding a new tenant

**1. Provision the key.** Generate with `openssl rand -hex 24`, prefix `if_live_`, and
append the pair to **both** secrets so they stay in sync:

```bash
fly secrets set --app intelliforge-otp-api        OTP_API_KEYS="<existing>,hrms:if_live_xxx"
fly secrets set --app intelliforge-whatsapp-hub   WHATSAPP_API_KEYS="<existing>,hrms:if_live_xxx"
```

Fly will not print the existing value back (see *Secret plumbing* below), so read it off
the machine first or you will clobber every other tenant.

**2. Register the inbound webhook** in the hub's `WHATSAPP_TENANT_WEBHOOKS`, same
`tenant:value` shape, comma-separated:

```
bootcamp:https://upskill.intelliforge.tech/api/whatsapp/inbound
```

⚠️ **Probe the exact URL before registering it.** A wrong host *or path* fails silently:
sends keep working and only inbound replies vanish, so nothing looks broken. Two real
cases, both caught this way — the docs said `bootcamp.intelliforge.tech` (does not
resolve; the app is at `upskill`), and an `hrms` entry pointed at `/api/whatsapp/inbound`
when that app's route is `/api/webhooks/whatsapp`. Note the path differs per product.

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://<host>/<path> \
  -H 'content-type: application/json' -d '{}'
# 403 = alive and rejecting correctly   000 = dead host
# 401 = middleware ate it — not a public webhook route
# 404 = wrong path
```

**3. Set the product env in its hosting platform** — `OTP_API_KEY`,
`WHATSAPP_HUB_API_KEY`, `WHATSAPP_HUB_URL`, `WHATSAPP_TENANT_ID`. `OTP_SERVICE_URL` and
`OTP_TENANT_ID` have working defaults.

**Documenting these in `.env.example` does nothing for the deployed app.** Set them per
environment in Vercel/Fly and **redeploy** — this is the single most common cause of
production 500s (see [deploy-vercel](../deploy-vercel/SKILL.md)).

**4. Verify with the ladder below** before declaring it done.

## Client module pattern

Never throw at import time — the app must boot with these unset:

```ts
function getConfig() {
  const baseUrl = process.env.WHATSAPP_HUB_URL?.replace(/\/$/, "");
  const apiKey = process.env.WHATSAPP_HUB_API_KEY;
  const tenantId = process.env.WHATSAPP_TENANT_ID ?? "bootcamp";
  if (!baseUrl || !apiKey) return null;      // null, not throw
  return { baseUrl, apiKey, tenantId };
}

export function isWhatsAppHubConfigured(): boolean {
  return getConfig() !== null;
}
```

Export an `isXConfigured()` guard beside every client and **call it in the route**.

## Route error contract

This is the failure that cost the most time. A missing key threw inside the client,
escaped an unguarded route, and Next returned **500 with an empty body**. The login UI
did `await res.json()` on that body, which threw, landing in its network-error branch —
so a server misconfiguration was reported to users as *"Network error. Check your
connection."*

Rules, in order:

1. **Validate the caller's input first**, before touching server config. A bad request
   deserves a 400 whether or not keys are set. (`/api/razorpay` had this backwards and
   returned 500 CONFIG_ERROR for an invalid plan.)
2. **Missing config → 503** with a structured, parseable body.
3. **Upstream failure → 502**, wrapped in try/catch.
4. **Always `req.json().catch(() => null)`** — a malformed body is a 400, never a 500.

```ts
const phone = normalizePhoneE164(input?.phone);
if (!phone) return NextResponse.json({ error: "invalid_phone", message: "…" }, { status: 400 });

if (!isOtpConfigured()) {
  console.error("[otp/request] not configured — set OTP_API_KEY (or WHATSAPP_HUB_API_KEY)");
  return NextResponse.json(
    { error: "otp_not_configured", message: "WhatsApp login is unavailable right now." },
    { status: 503 }
  );
}

try {
  const { status, body } = await requestLoginOtp(phone);
  return NextResponse.json(body, { status });
} catch (err) {
  console.error("[otp/request] upstream failed:", err);
  return NextResponse.json({ error: "otp_upstream_failed", message: "…" }, { status: 502 });
}
```

503 vs 502 makes "we're misconfigured" and "the service is down" distinguishable in logs.

Inbound webhooks must reject tenant mismatches (`403 tenant_mismatch`) and swallow
malformed forwards with a 200 — never 500 back at the hub, or it will retry forever.

## Minting the product's session from a verified OTP

On `verified: true`, mint **the product's own session** — the OTP service proves
possession, nothing more. Two shapes exist in the estate:

- **Products with their own auth** (hrms: `jose` JWT in an HTTP-only cookie) just issue
  their normal session on verify. Simplest case, and it sidesteps everything below.
- **Products on Clerk** (bootcamp) mint a sign-in token the client redeems with the
  **ticket** strategy. On newer Clerk with signals hooks, use the imperative API:
  `clerk.client.signIn.create({ strategy: "ticket", ticket })` then
  `clerk.setActive({ session })`.

Either way, map the verified number onto an account deliberately: find-or-create is right
for self-serve signup, but a closed system (hrms, where HR creates interns) should reject
an unknown number rather than create one, and refuse ambiguously-matched numbers instead
of guessing which account to sign in.

### The Clerk phone trap

**Do not key the Clerk user by phone number.** On the IntelliForge instance that fails
twice — and the second failure is not a dashboard toggle:

```
phone_number is not a valid parameter for this request.   ← attribute disabled
Phone numbers from this country (India) are currently not supported.  ← country block
```

The second is not a dashboard toggle. Key off a derived email on a domain you own and
keep the real number in metadata so a later migration is a backfill, not a re-signup:

```ts
export function derivedEmailForPhone(phoneE164: string): string {
  return `${phoneE164.replace(/\D/g, "")}@phone.intelliforge.tech`;
}

const existing = await clerk.users.getUserList({ emailAddress: [emailAddress] });
const user =
  existing.data[0] ??
  (await clerk.users.createUser({
    emailAddress: [emailAddress],
    publicMetadata: { phone: phoneE164, viaWhatsappOtp: true },
    skipPasswordRequirement: true,   // instance marks password required
  }));

const { token } = await clerk.signInTokens.createSignInToken({
  userId: user.id,
  expiresInSeconds: 60,
});
```

Client redeems it with `signIn.create({ strategy: "ticket", ticket: token })`.

Derived addresses cannot receive mail — never point notifications at the Clerk identity.

**Surface Clerk's real error.** `ClerkAPIResponseError.message` is only the HTTP status
("Bad Request"); the actionable reason is in `errors[]`:

```ts
const detail = (err as { errors?: { longMessage?: string; message?: string }[] })
  .errors?.map((e) => e.longMessage ?? e.message).filter(Boolean).join("; ")
  || (err as Error).message;
```

Read instance settings **read-only** before guessing — this endpoint is public:

```bash
curl -s "https://<slug>.clerk.accounts.dev/v1/environment?__clerk_api_version=2021-02-05&_clerk_js_version=5" \
  | grep -oE '"(email_address|phone_number|password)":\{[^}]*'
```

`enabled`, `required`, and `used_for_first_factor` explain most `createUser` rejections.
A `pk_test_` key on a production domain means production is running a Clerk **development**
instance — worth flagging.

## Secret plumbing realities

- **Fly never returns secret values.** `fly secrets list` shows names + digests only.
  Reading a value requires `fly ssh console -a <app> -C "printenv KEY"`. Matching digests
  across two apps prove they share a value without reading either.
- **Vercel env changes need a redeploy** — `vercel redeploy --scope <team> <url>`, or push.
  Omitting `--scope` fails with "Deployment belongs to a different team".
- `vercel link` pulls a **development** `.env.local` and appends duplicate `.vercel` /
  `.env*.local` lines to `.gitignore` on every run. Check `git status` afterwards.

## Gotchas — each of these has bitten in production

| Symptom | Cause → fix |
|---|---|
| bodyless `500` on `/api/auth/otp/*` | `OTP_API_KEY` unset in the host platform → the client throws. Set it + redeploy, and harden the route to return 503 (see *Route error contract*). |
| `tenant_mismatch` (403) in hub logs | `WHATSAPP_TENANT_ID` / `X-Tenant-Id` ≠ the tenant the key maps to. Confirm the real tenant with `GET <hub>/v1/messages`, which returns `{"tenantId":…}`. |
| Meta error `100`, "Object with ID '+91…' does not exist" | Hub `WHATSAPP_PHONE_NUMBER_ID` holds the **display number** instead of the **numeric Phone Number ID**. Get it from `GET /{WABA_ID}/phone_numbers` or Meta → WhatsApp → API Setup. |
| Meta error `100` on an OTP (auth) template | The send is body-only. **Authentication** templates need the code echoed into the button too: `{type:"button",sub_type:"url",index:"0",parameters:[{type:"text",text:code}]}`. |
| template not found / language error | The auth template (e.g. `intelliforge_login`) must be **APPROVED**, category **Authentication**, language matching what the code sends (`en`). |
| `request` returns 200 but no code arrives | Delivery is async in the worker — `fly logs --app intelliforge-otp-worker` and look for `delivery_sent` vs `delivery_failed`. |
| hub rejects a send for a valid number | The hub **requires opt-in before it will send**. Call `/v1/contacts/opt-in` at signup, or lazily before the first send. |
| `clerk_mint_failed` "Bad Request" | Clerk's real reason is in `errors[]`, not `.message` — see the Clerk phone trap above. |

**Constraints:** E.164 only; **`+91` by default** (`ALLOWED_COUNTRY_CODES`); no SMS
fallback, so the recipient must have WhatsApp; rate limits are a 30s cooldown and 5/hour,
so handle `429` with `retryInSeconds` rather than retrying blindly.

## Diagnosis ladder

Work outward; each rung isolates a layer.

```bash
# 1. Are the upstream services alive?
curl -s https://intelliforge-otp-api.fly.dev/health
curl -s https://intelliforge-whatsapp-hub.fly.dev/health

# 2. What does the product route actually return? (503 = config, 502 = upstream, 500 = bug)
curl -s -w "\nHTTP %{http_code}\n" -X POST https://<app>/api/auth/otp/request \
  -H 'content-type: application/json' --data-raw '{"phone":"not-a-phone"}'

# 3. Is the hub wired up? (read-only, sends nothing)
curl -s https://<app>/api/admin/whatsapp/test        # {"ok":true,"configured":true}

# 4. What threw? Caught errors appear in logs, not the errors table.
#    Vercel MCP: get_runtime_errors (uncaught) / get_runtime_logs (console.*)

# 5. Full round trip with a real number (sends an actual message — use your own)
curl -s -X POST $OTP_SERVICE_URL/v1/otp/request -H "Authorization: Bearer $KEY" \
  -H "X-Tenant-Id: $TENANT" -H "Content-Type: application/json" \
  -d '{"phone":"+91XXXXXXXXXX","purpose":"login","channel":"whatsapp"}'   # → {"sent":true}
# read the code off WhatsApp, then POST /v1/otp/verify with it        → {"verified":true}
```

Prove a fix against the real service **before shipping** with a throwaway probe rather
than burning an OTP round-trip to find out:

```bash
npx dotenv -e .env.local -- npx tsx tmp-probe.ts   # then delete it
```

## E2E rules

- **Never test the happy path.** A valid phone sends a real WhatsApp message and burns
  rate limit; an authorized admin call mutates enrollments and fires fulfilment. Cover
  validation and rejection only.
- **Gate on dependency presence, don't fake green:**
  ```ts
  const HAS_DB = envLocal("DATABASE_URL", "") !== "";
  test.skip(!HAS_DB, "needs a seeded DATABASE_URL — page renders sold out without one");
  ```
  Test workers do not inherit the webServer env, so read `.env.local` the same way the
  Playwright config does.
- **Assert auth is checked before the body is parsed** — a malformed body must still 401,
  so an anonymous caller cannot probe input validity.
- Assert `clerkSignInToken` is **absent** on every rejected verification.
- Prefer a single unambiguous `aria-label` over several `getByText` calls; components
  rendered more than once per page cause strict-mode violations.
- Clicks that race hydration are silently dropped. `await page.waitForLoadState("networkidle")`
  before clicking a button whose handler drives navigation.

## Env reference

| Product app | Source |
|---|---|
| `OTP_API_KEY` | a `tenant:key` value from otp-api `OTP_API_KEYS` |
| `OTP_SERVICE_URL` | defaults to `https://intelliforge-otp-api.fly.dev` |
| `OTP_TENANT_ID` | defaults to `WHATSAPP_TENANT_ID`, then `"bootcamp"` |
| `WHATSAPP_HUB_API_KEY` | same key; also the `OTP_API_KEY` fallback |
| `WHATSAPP_HUB_URL` | `https://intelliforge-whatsapp-hub.fly.dev` |
| `WHATSAPP_TENANT_ID` | must match the tenant in the key pair |
| `WHATSAPP_WELCOME_TEMPLATE` | approved template name for sends |
