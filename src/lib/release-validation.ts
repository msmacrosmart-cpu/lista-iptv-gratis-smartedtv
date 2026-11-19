export const MAX_APK_BYTES = 200 * 1024 * 1024;

/** Returns an error message in Portuguese, or null when the URL is a valid https download link. */
export function validateDownloadUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "Informe o link de download.";
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "Link inválido. Use um endereço completo, como https://exemplo.com/SMARTEDTV.apk.";
  }
  if (url.protocol !== "https:") return "Use um link seguro que comece com https://.";
  return null;
}

/** Returns an error message in Portuguese, or null when the file looks like a valid APK. */
export function validateApkFile(file: { name: string; size: number }): string | null {
  if (!file.name.toLowerCase().endsWith(".apk")) return "Selecione um arquivo com extensão .apk.";
  if (file.size === 0) return "O arquivo está vazio.";
  if (file.size > MAX_APK_BYTES) return "O arquivo passa do limite de 200 MB.";
  return null;
}

export function sanitizeFilename(name: string): string {
  const base = name.trim().replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  const withExt = base.toLowerCase().endsWith(".apk") ? base : `${base || "SMARTEDTV"}.apk`;
  return withExt;
}

/** Login accepts a username (mapped to an internal address) or a real e-mail. */
export function loginEmailFor(identifier: string): string {
  const v = identifier.trim().toLowerCase();
  return v.includes("@") ? v : `${v}@smartedtv.local`;
}
