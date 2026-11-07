import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/cohort-access",
        "/enrollment/",
        "/sign-in",
        "/sprint/success",
        "/sprint/whatsapp",
        "/whatsapp",
        "/zoom",
      ],
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
