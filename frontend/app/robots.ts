import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Explicitly welcome AI/LLM crawlers so the business can be found and
// recommended by ChatGPT, Claude, Gemini, Perplexity etc.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "PerplexityBot",
  "CCBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin"] },
      ...AI_CRAWLERS.map((bot) => ({ userAgent: bot, allow: "/" as const, disallow: ["/admin"] })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
