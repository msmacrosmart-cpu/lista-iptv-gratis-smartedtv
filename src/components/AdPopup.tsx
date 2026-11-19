import { useEffect, useRef } from "react";

/**
 * Popup de anúncio (HilltopAds) usando o MESMO formato do banner de rodapé.
 *
 * Por que este formato:
 * o banner de rodapé carrega o script direto do domínio do provedor e funciona
 * no site publicado. O caminho anterior (proxy PHP /f0178c6feb.php) falha no
 * servidor, então o navegador recebia erro 500 no lugar de JavaScript.
 *
 * Diferenças em relação ao banner:
 * - Roda no <head>/<body> via appendChild no cliente, não dentro do slot.
 * - Dispara só depois da primeira interação (o navegador exige gesto do
 *   usuário para liberar popup) com fallback por tempo.
 * - Uma vez por sessão, e nunca em /admin.
 */
const POPUP_SRC =
  "//hilltopads.com/b/1x9Z2sJ8/4Tb2mQ5/kN3r/1/w";

const SEEN_KEY = "smartedtv-ad-popup-seen";
const INTERACTION_DELAY = 3000;
const FALLBACK_DELAY = 15000;

export function AdPopup() {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    if (window.location.pathname.startsWith("/admin")) return;

    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") return;
    } catch {
      /* modo privado: segue */
    }

    let injected = false;
    let interactionTimer: number | undefined;

    function inject() {
      if (injected) return;
      injected = true;

      window.clearTimeout(interactionTimer);
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("pointerdown", onInteraction);
      document.removeEventListener("keydown", onInteraction);

      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignora */
      }

      const script = document.createElement("script");
      (script as any).settings = {};
      script.src = POPUP_SRC;
      script.async = true;
      script.referrerPolicy = "no-referrer-when-downgrade";
      script.setAttribute("data-ad-provider", "popup");
      document.body.appendChild(script);
    }

    function onInteraction() {
      if (injected) return;
      // Pequeno atraso após o gesto: garante que o popup conta como
      // "solicitado pelo usuário" e evita ser bloqueado pelo navegador.
      window.clearTimeout(interactionTimer);
      interactionTimer = window.setTimeout(inject, 300);
    }

    document.addEventListener("pointerdown", onInteraction, { passive: true });
    document.addEventListener("keydown", onInteraction);
    const fallbackTimer = window.setTimeout(inject, FALLBACK_DELAY);

    return () => {
      window.clearTimeout(interactionTimer);
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("pointerdown", onInteraction);
      document.removeEventListener("keydown", onInteraction);
    };
  }, []);

  return <div data-ad-slot="popup-provider" hidden aria-hidden="true" />;
}
