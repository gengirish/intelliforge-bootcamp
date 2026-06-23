import { defineConfig } from "@playwright/test";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const E2E_PORT = process.env.E2E_PORT || "3100";
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${E2E_PORT}`;

function loadEnvLocal(): Record<string, string> {
  const path = resolve(process.cwd(), ".env.local");
  const env: Record<string, string> = {};
  if (!existsSync(path)) return env;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const localEnv = loadEnvLocal();

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  timeout: 30_000,
  expect: { timeout: 10_000 },
  webServer: {
    command: `npx next dev --turbopack -p ${E2E_PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      ...localEnv,
      E2E_BYPASS_CLERK: "1",
      NEXT_PUBLIC_E2E_BYPASS: "1",
      RAZORPAY_WEBHOOK_SECRET:
        localEnv.RAZORPAY_WEBHOOK_SECRET || "e2e_webhook_secret",
    },
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
