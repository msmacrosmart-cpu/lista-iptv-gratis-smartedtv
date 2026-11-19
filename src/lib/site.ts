/**
 * Configuração única de domínio do site.
 * Usada em robots.txt, sitemap.xml, canonical, og:url e JSON-LD.
 */
export const SITE_URL = "https://lista-iptv-gratis-smartedtv.xyz";

export const SITE_HOST = "lista-iptv-gratis-smartedtv.xyz";

export const SITE_NAME = "SMARTEDTV | IPTV Grátis";

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
