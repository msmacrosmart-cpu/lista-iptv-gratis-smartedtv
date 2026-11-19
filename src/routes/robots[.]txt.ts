import { createFileRoute } from "@tanstack/react-router";
import { siteUrlFrom } from "@/lib/site";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const base = siteUrlFrom(request);
        const body = [
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
          `Sitemap: ${base}/sitemap.xml`,
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
