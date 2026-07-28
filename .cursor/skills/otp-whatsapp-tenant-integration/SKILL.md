---
name: otp-whatsapp-tenant-integration
description: >-
  Wires a product app into the hosted IntelliForge OTP API and WhatsApp hub as a
  tenant — bearer/tenant clients, config-gap error contracts, Clerk session
  minting after a verified OTP, Fly and Vercel secret plumbing, and E2E patterns
  that never trigger real sends. Use when adding WhatsApp OTP login or WhatsApp
  messaging to a product, onboarding a new tenant, or debugging otp_not_configured,
  tenant_mismatch, clerk_mint_failed, or bare 500s from /api/auth/otp/*.
---

# OTP / WhatsApp Tenant Integration

Product apps (bootcamp, awaazos, aaramse, …) hold **no Meta or Gupshup credentials**.
They are tenants of two Fly services, reached over HTTP with a bearer key:

| Service | Host | Purpose |
|---|---|---|
| `intelliforge-otp-api` | `intelliforge-otp-api.fly.dev` | OTP request/verify over WhatsApp |
| `intelliforge-whatsapp-hub` | `intelliforge-whatsapp-hub.fly.dev` | opt-in, template sends, inbound forwarding |

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

1. Append `tenant:if_live_<new>` to `OTP_API_KEYS` **and** `WHATSAPP_API_KEYS` (same key).
2. Add the tenant's inbound webhook to `WHATSAPP_TENANT_WEBHOOKS` on the hub — same
   `tenant:value` shape, comma-separated:
   ```
   bootcamp:https://upskill.intelliforge.tech/api/whatsapp/inbound
   ```
   ⚠️ Use the app's **real production domain**. The hub's `DEPLOY.md` and `.env.example`
   both show `bootcamp.intelliforge.tech`, which does not resolve — the bootcamp app is
   served at `upskill.intelliforge.tech`. A wrong host here fails silently: sends still
   work, only inbound replies vanish. Verify with:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://<host>/api/whatsapp/inbound \
     -H 'content-type: application/json' -d '{}'   # 403 = alive, 000 = dead host
   ```
3. Set in the product's host (Vercel): `OTP_API_KEY`, `WHATSAPP_HUB_API_KEY`,
   `WHATSAPP_HUB_URL`, `WHATSAPP_TENANT_ID`. `OTP_SERVICE_URL` and `OTP_TENANT_ID`
   have working defaults.
4. **Redeploy.** Env changes do not apply to existing deployments.
5. Verify with the ladder below before declaring it done.

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

## Minting a Clerk session from a verified OTP

Possession is already proven by the OTP service; Clerk only mints the session. **Do not
key the Clerk user by phone number.** On the IntelliForge instance that fails twice:

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
