import { createFileRoute } from "@tanstack/react-router";
import { siteUrlFrom } from "@/lib/site";

const LAST_MOD = "2026-11-19";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const base = siteUrlFrom(request);

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          `  <url><loc>${base}/</loc><lastmod>${LAST_MOD}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
