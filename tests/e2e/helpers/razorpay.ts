import crypto from "crypto";
import { envLocal } from "./env-local";

/** playwright.config.ts forces this same fallback into the webServer env. */
const WEBHOOK_SECRET = envLocal("RAZORPAY_WEBHOOK_SECRET", "e2e_webhook_secret");

/** Signs a raw webhook body the way Razorpay does, so the route accepts it. */
export function signWebhook(body: string): string {
  return crypto.createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex");
}
