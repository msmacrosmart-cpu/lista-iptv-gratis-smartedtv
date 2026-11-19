import { useEffect, useRef } from "react";

/**
 * Banner de anúncio (massivesalad) renderizado no fim do site.
 *
 * O script é injetado apenas no cliente, uma única vez, e apenas se o
 * contêiner estiver visível — evita duplicação em navegações do SPA.
 */
const BANNER_SRC =
  "//massivesalad.com/b/XRVtsUd.GNln0yYyWicP/pebm/9-uCZ/UYl/k/PNTUcj2CNPD/I/wiMODOkItcNkzxYI0QMPjFAzxxMWwg";

export function AdBanner({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    const host = hostRef.current;
    if (!host) return;
    injectedRef.current = true;

    const script = document.createElement("script");
    (script as any).settings = {};
    script.src = BANNER_SRC;
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    host.appendChild(script);

    return () => {
      // Mantém o script no DOM; o provedor não suporta reinjeção limpa.
      injectedRef.current = true;
    };
  }, []);

  return (
    <div className={className}>
      <p className="label-text mb-2 text-center text-[9px] text-silver/70">Publicidade</p>
      <div ref={hostRef} className="flex min-h-[90px] w-full items-center justify-center overflow-hidden" data-ad-slot="footer-banner" />
    </div>
  );
}
