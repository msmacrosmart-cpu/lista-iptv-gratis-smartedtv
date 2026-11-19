import { useEffect, useRef, useState } from "react";
import { ChevronDown, Megaphone, X } from "lucide-react";

/**
 * Popup de anúncio (fluffy-machine), minimizável.
 *
 * Regras:
 * - Só aparece no cliente, depois de um pequeno atraso (não bloqueia a primeira
 *   renderização nem o LCP).
 * - Aparece no máximo uma vez por sessão de navegação.
 * - Fechar/minimizar nunca impede o uso do site: o anúncio fica num iframe
 *   isolado, fora do fluxo do conteúdo.
 */
const POPUP_SRC =
  "https://fluffy-machine.com/bi3MVd0kP.3upCv/bGmmVeJMZ_D/0Z3cNfjhQXyeM/D/A/xbLhTdcL2IN/DeI-w/MgD/UK";

const SEEN_KEY = "smartedtv-ad-popup-seen";

export function AdPopup() {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* modo privado */
    }
    if (alreadySeen) return;

    const timer = window.setTimeout(() => {
      setVisible(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignora */
      }
    }, 6000);

    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Publicidade"
      className="fixed bottom-4 left-4 z-[60] w-[min(92vw,360px)]"
    >
      <div className="glass-card overflow-hidden border-silver/50 bg-background shadow-2xl">
        <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary px-3 py-2">
          <p className="label-text flex items-center gap-1.5 text-[9px] text-silver">
            <Megaphone className="h-3 w-3" aria-hidden /> Publicidade
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMinimized((v) => !v)}
              aria-label={minimized ? "Expandir anúncio" : "Minimizar anúncio"}
              aria-expanded={!minimized}
              className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${minimized ? "" : "rotate-180"}`} aria-hidden />
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar anúncio"
              className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <div hidden={minimized} className="h-[280px] w-full bg-black/40">
          <iframe
            src={POPUP_SRC}
            title="Publicidade"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
            className="h-full w-full border-0"
          />
        </div>

        {minimized && (
          <button
            type="button"
            onClick={() => setMinimized(false)}
            className="w-full px-3 py-2 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Mostrar anúncio
          </button>
        )}
      </div>
    </aside>
  );
}
