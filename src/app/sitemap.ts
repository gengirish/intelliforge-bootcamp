import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Static routes worth indexing. The CCAR-F pages are search-led — they only pay
 * off if people looking for exam practice can find them.
 */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/sprint", priority: 0.9, changeFrequency: "weekly" },
  { path: "/research", priority: 0.6, changeFrequency: "monthly" },
  { path: "/claude", priority: 0.8, changeFrequency: "weekly" },
  { path: "/claude/quiz", priority: 0.8, changeFrequency: "weekly" },
  { path: "/claude/review", priority: 0.7, changeFrequency: "weekly" },
  { path: "/claude/foundations", priority: 0.7, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_CONFIG.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
