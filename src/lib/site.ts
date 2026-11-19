/**
 * URL pública do site, usada em robots.txt, sitemap.xml, canonical e Open Graph.
 *
 * Prioridade:
 * 1. Variável de ambiente (VITE_SITE_URL / SITE_URL) — defina no deploy.
 * 2. Origem da requisição (quando rodando no servidor).
 * 3. Fallback fixo.
 */
export const FALLBACK_SITE_URL = "https://lista-iptv-gratis-smartedtv.lovable.app";

export function siteUrlFrom(request?: Request): string {
  const fromEnv =
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SITE_URL) ||
    (typeof process !== "undefined" ? process.env?.SITE_URL : undefined);

  if (fromEnv) return String(fromEnv).replace(/\/+$/, "");
  if (request) {
    try {
      const origin = new URL(request.url).origin;
      if (origin && !origin.includes("localhost") && !origin.includes("127.0.0.1")) return origin;
    } catch {
      /* usa fallback */
    }
  }
  return FALLBACK_SITE_URL;
}

export function absoluteUrl(path: string, request?: Request): string {
  const base = siteUrlFrom(request);
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
