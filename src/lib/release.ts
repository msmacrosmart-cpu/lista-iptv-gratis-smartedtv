import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Release = {
  id: string; filename: string; storage_path: string | null; download_url: string | null;
  version: string; release_notes: string; is_active: boolean; created_at: string; updated_at: string;
};

/** Chave do link de download salvo pela página /admin neste navegador. */
export const LOCAL_RELEASE_KEY = "smartedtv-local-release";

export function getLocalRelease(): Release | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_RELEASE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Release>;
    if (!parsed.download_url && !parsed.storage_path) return null;
    return {
      id: parsed.id ?? "local",
      filename: parsed.filename ?? "SMARTEDTV.apk",
      storage_path: parsed.storage_path ?? null,
      download_url: parsed.download_url ?? null,
      version: parsed.version ?? "",
      release_notes: parsed.release_notes ?? "",
      is_active: true,
      created_at: parsed.created_at ?? new Date().toISOString(),
      updated_at: parsed.updated_at ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveLocalRelease(r: Release): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_RELEASE_KEY, JSON.stringify(r));
}

export function clearLocalRelease(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LOCAL_RELEASE_KEY);
}

export const activeReleaseQuery = queryOptions({
  queryKey: ["active-release"],
  queryFn: async (): Promise<Release | null> => {
    // Link definido na página /admin (neste navegador) tem prioridade.
    const local = getLocalRelease();
    if (local) return local;
    const { data, error } = await supabase.from("app_releases").select("*").eq("is_active", true).maybeSingle();
    if (error) throw error;
    return data as Release | null;
  },
  staleTime: 60_000,
});

export async function resolveDownloadUrl(r: Release): Promise<string> {
  if (r.storage_path) {
    const { data, error } = await supabase.storage.from("apks").createSignedUrl(r.storage_path, 600, { download: r.filename });
    if (error || !data) throw error ?? new Error("no url");
    return data.signedUrl;
  }
  if (r.download_url) return r.download_url;
  throw new Error("Nenhum arquivo configurado");
}
