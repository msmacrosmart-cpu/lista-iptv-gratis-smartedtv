import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";

const BODY = [
  "# robots.txt - SMARTEDTV | Lista IPTV Grátis",
  "User-agent: *",
  "Allow: /",
  "Disallow: /admin",
  "Disallow: /reset-password",
  "",
  "# Google e imagens",
  "User-agent: Googlebot",
  "Allow: /",
  "Disallow: /admin",
  "",
  "User-agent: Googlebot-Image",
  "Allow: /",
  "",
  "User-agent: Bingbot",
  "Allow: /",
  "Disallow: /admin",
  "",
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  "",
].join("\n");

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(BODY, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
