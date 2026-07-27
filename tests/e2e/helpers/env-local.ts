import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

/**
 * Reads .env.local the same way playwright.config.ts does when building the
 * webServer env. Tests run in worker processes that do not inherit that env,
 * so anything a route reads from .env.local has to be read here too — otherwise
 * assertions hardcode the default and fail on machines that configure a value.
 */
const cache = new Map<string, string | undefined>();

function loadEnvLocal(): Map<string, string | undefined> {
  if (cache.size > 0) return cache;

  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) {
    cache.set("__loaded__", "1");
    return cache;
  }

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
    cache.set(key, val);
  }
  cache.set("__loaded__", "1");
  return cache;
}

export function envLocal(key: string, fallback: string): string {
  return loadEnvLocal().get(key) ?? process.env[key] ?? fallback;
}
