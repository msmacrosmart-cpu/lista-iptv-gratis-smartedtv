import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Release = {
  id: string; filename: string; storage_path: string | null; download_url: string | null;
  version: string; release_notes: string; is_active: boolean; created_at: string; updated_at: string;
};

export const activeReleaseQuery = queryOptions({
  queryKey: ["active-release"],
  queryFn: async (): Promise<Release | null> => {
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
