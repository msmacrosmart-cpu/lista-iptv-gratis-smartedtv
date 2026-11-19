import { useEffect, useRef } from "react";

/**
 * Popup de anúncio (fluffy-machine).
 *
 * IMPORTANTE — por que NÃO usar <iframe> aqui:
 * as redes de popup entregam um script que cria a própria camada flutuante e
 * depende de rodar na janela principal (window.open, document.write, cookies de
 * primeira parte). Dentro de um iframe com sandbox/allow-popups o script roda
 * mas o popup fica preso ao iframe e nunca aparece — era exatamente o que
 * bloqueava o anúncio. Além disso, o navegador bloqueia popups que não vêm de
 * uma ação do usuário no frame.
 *
 * Solução: injetar o <script> do provedor direto no <body>, uma única vez.
 *
 * Regras de segurança/experiência:
 * - Roda só no cliente e só depois de o usuário interagir ou após um atraso,
 *   que é o que os navegadores exigem para liberar popups.
 * - Uma vez por sessão (sessionStorage).
 * - Nunca no /admin.
 * - Marca o container como data-ad-provider para o anunciante medir o slot.
 */
const POPUP_SRC =
  "https://fluffy-machine.com/bi3MVd0kP.3upCv/bGmmVeJMZ_D/0Z3cNfjhQXyeM/D/A/xbLhTdcL2IN/DeI-w/MgD/UK";

const SEEN_KEY = "smartedtv-ad-popup-seen";

export function AdPopup() {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    // Não anuncia em páginas internas/admin.
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) return;

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* modo privado: segue e marca só em memória */
    }
    if (alreadySeen) return;

    let injected = false;

    function inject() {
      if (injected) return;
      injected = true;
      document.removeEventListener("pointerdown", inject);
      document.removeEventListener("keydown", inject);

      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignora */
      }

      const script = document.createElement("script");
      script.src = POPUP_SRC;
      script.async = true;
      script.referrerPolicy = "no-referrer-when-downgrade";
      script.setAttribute("data-ad-provider", "popup");
      document.body.appendChild(script);
    }

    // Primeiro toque/clique/tecla libera popup no navegador; se ninguém
    // interagir, injeta mesmo assim após 12s.
    document.addEventListener("pointerdown", inject, { once: true, passive: true });
    document.addEventListener("keydown", inject, { once: true });
    const timer = window.setTimeout(inject, 12_000);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", inject);
      document.removeEventListener("keydown", inject);
    };
  }, []);

  // O criativo é renderizado pelo próprio fornecedor; a página só hospeda o script.
  return <div data-ad-slot="popup-provider" hidden aria-hidden="true" />;
}
