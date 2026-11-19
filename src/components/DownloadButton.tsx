import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { activeReleaseQuery, resolveDownloadUrl } from "@/lib/release";
import { cn } from "@/lib/utils";

export function DownloadButton({ className, showMeta = true }: { className?: string; showMeta?: boolean }) {
  const { data: release, isLoading, isError } = useQuery(activeReleaseQuery);
  const [busy, setBusy] = useState(false);
  const unavailable = !isLoading && (isError || !release);

  async function handleClick() {
    if (!release) return;
    setBusy(true);
    try {
      const url = await resolveDownloadUrl(release);
      const a = document.createElement("a");
      a.href = url;
      a.rel = "noopener";
      a.download = release.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Download iniciado", { description: `${release.filename} está sendo baixado.` });
    } catch {
      toast.error("Download indisponível no momento", { description: "Tente novamente em alguns minutos." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading || busy || unavailable}
        aria-busy={isLoading || busy}
        className={cn("cta-button text-sm sm:text-base", className)}
      >
        {isLoading || busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Download className="h-5 w-5" aria-hidden />}
        {isLoading ? "Carregando..." : busy ? "Preparando download..." : "Baixe o aplicativo aqui"}
      </button>
      {showMeta && (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {isLoading && "Verificando a versão mais recente..."}
          {unavailable && (
            <span className="inline-flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden />
              {isError ? "Download indisponível no momento. Tente mais tarde." : "Nenhuma versão publicada ainda. Volte em breve."}
            </span>
          )}
          {release && `${release.filename}${release.version ? ` · versão ${release.version}` : ""} · Android`}
        </p>
      )}
    </div>
  );
}
