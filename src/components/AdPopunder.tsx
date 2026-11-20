import { useEffect } from "react";

/**
 * Popunder (HilltopAds / vapid-size).
 *
 * Injetado no cliente, uma única vez, pelo mesmo padrão do AdBanner — que
 * funciona em produção. Não usamos a tag inline pré-renderizada porque ela
 * depende de `document.currentScript`, que retorna null em páginas
 * pré-renderizadas/hidratadas: o fallback insere o script no lugar errado e
 * o provedor não reconhece o contexto.
 */
const POPUNDER_SRC =
  "//vapid-size.com/c.Dz9B6Gbb2U5tlrSnW/QH9uNEz_YF0/MnjFAjwWMpSE0p3GNPj/QoyvMoDsA/1O";

export function AdPopunder() {
  useEffect(() => {
    // O painel administrativo não deve disparar anúncio.
    if (window.location.pathname.startsWith("/admin")) return;

    // Evita duplicação (StrictMode em dev e remontagens do SPA).
    if (document.querySelector('script[data-ad-provider="popunder"]')) return;

    const script = document.createElement("script");
    (script as unknown as { settings: Record<string, unknown> }).settings = {};
    script.src = POPUNDER_SRC;
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.setAttribute("data-ad-provider", "popunder");
    document.body.appendChild(script);
  }, []);

  return null;
}
