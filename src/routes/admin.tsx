import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Link2, Loader2, LogOut, ShieldCheck, Trash2, Tv } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DownloadButton } from "@/components/DownloadButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  activeReleaseQuery,
  clearLocalRelease,
  getLocalRelease,
  saveLocalRelease,
  type Release,
} from "@/lib/release";
import { loginEmailFor, sanitizeFilename, validateDownloadUrl } from "@/lib/release-validation";

const ADMIN_USER = "admin1997";
const ADMIN_PASS = "admin577";
const SESSION_KEY = "smartedtv-admin";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Administração | SMARTEDTV" },
      { name: "description", content: "Área administrativa do SMARTEDTV para gerenciar o link de download do aplicativo." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

type Mode = "supabase" | "local";

function Admin() {
  const queryClient = useQueryClient();
  const { data: release } = useQuery(activeReleaseQuery);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [mode, setMode] = useState<Mode | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("SMARTEDTV.apk");
  const [version, setVersion] = useState("");
  const [notes, setNotes] = useState("");

  // Restaura a sessão ao abrir a página.
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setMode("supabase");
        } else if (sessionStorage.getItem(SESSION_KEY) === "local") {
          setMode("local");
        }
      } catch {
        if (sessionStorage.getItem(SESSION_KEY) === "local") setMode("local");
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  // Preenche o formulário com o link atual.
  useEffect(() => {
    if (release) {
      setUrl(release.download_url ?? "");
      setFilename(release.filename || "SMARTEDTV.apk");
      setVersion(release.version ?? "");
      setNotes(release.release_notes ?? "");
    }
  }, [release]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const u = user.trim();
    // 1) Tenta o login no Supabase (vale para todos os visitantes).
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmailFor(u),
        password: pass,
      });
      if (!error && data.session) {
        setMode("supabase");
        toast.success("Login realizado", { description: "Link salvo aqui valerá para todos os visitantes." });
        setBusy(false);
        return;
      }
    } catch {
      // segue para a verificação local
    }
    // 2) Verificação local (vale neste navegador).
    if (u === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "local");
      setMode("local");
      toast.success("Login realizado", { description: "Link salvo aqui valerá neste navegador." });
    } else {
      setErr("Usuário ou senha incorretos.");
    }
    setBusy(false);
  }

  async function logout() {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignora
    }
    sessionStorage.removeItem(SESSION_KEY);
    setMode(null);
    setUser("");
    setPass("");
    toast.success("Sessão encerrada");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const urlErr = validateDownloadUrl(url);
    if (urlErr) return setErr(urlErr);
    const fname = sanitizeFilename(filename || "SMARTEDTV.apk");
    setBusy(true);

    const local: Release = {
      id: getLocalRelease()?.id ?? "local",
      filename: fname,
      storage_path: null,
      download_url: url.trim(),
      version: version.trim(),
      release_notes: notes.trim(),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let published = false;
    if (mode === "supabase") {
      const { error } = await supabase.rpc("publish_release", {
        _filename: fname,
        _storage_path: "",
        _download_url: url.trim(),
        _version: version.trim(),
        _release_notes: notes.trim(),
      });
      if (error) {
        toast.error("Não foi possível publicar para todos", {
          description: "O link foi salvo neste navegador. Verifique se o usuário tem permissão de administrador.",
        });
      } else {
        published = true;
      }
    }

    // Sempre salva neste navegador para os botões atualizarem na hora.
    saveLocalRelease(local);
    await queryClient.invalidateQueries({ queryKey: ["active-release"] });
    setBusy(false);
    if (published) {
      toast.success("Link publicado!", { description: "Os botões de download já estão atualizados para todos." });
    } else if (mode === "local") {
      toast.success("Link salvo neste navegador", { description: "Os botões de download foram atualizados aqui." });
    }
  }

  function removeLocal() {
    clearLocalRelease();
    queryClient.invalidateQueries({ queryKey: ["active-release"] });
    toast.success("Link local removido", { description: "Os botões voltaram a usar o link publicado." });
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <Loader2 className="h-6 w-6 animate-spin text-silver" aria-hidden />
      </main>
    );
  }

  if (!mode) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-10">
        <form onSubmit={login} className="glass-card w-full max-w-sm space-y-4 p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center bg-primary text-primary-foreground"><Tv className="h-5 w-5" aria-hidden /></span>
            <h1 className="title-text text-lg">Área do administrador</h1>
          </div>
          <p className="text-sm text-muted-foreground">Entre para gerenciar o link de download do SMARTEDTV.</p>
          <div className="space-y-2">
            <Label htmlFor="admin-user">Usuário</Label>
            <Input id="admin-user" autoComplete="username" value={user} onChange={(e) => setUser(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-pass">Senha</Label>
            <Input id="admin-pass" type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} required />
          </div>
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
          <button type="submit" className="cta-button w-full text-sm" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ShieldCheck className="h-4 w-4" aria-hidden />}
            {busy ? "Entrando..." : "Entrar"}
          </button>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">Voltar ao site</Link>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center bg-primary text-primary-foreground"><Tv className="h-5 w-5" aria-hidden /></span>
          <div>
            <h1 className="title-text text-lg">Administração</h1>
            <p className="text-xs text-muted-foreground">
              {mode === "supabase" ? "Conectado — o link valerá para todos os visitantes." : "Conectado neste navegador — o link valerá aqui."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="ghost-button py-2 text-[10px]">Ver site</Link>
          <button type="button" onClick={logout} className="ghost-button py-2 text-[10px]"><LogOut className="h-3.5 w-3.5" aria-hidden />Sair</button>
        </div>
      </div>

      <form onSubmit={save} className="glass-card mt-8 space-y-4 p-6">
        <h2 className="title-text flex items-center gap-2 text-sm"><Link2 className="h-4 w-4 text-silver" aria-hidden />Link de download do app</h2>
        <p className="text-sm text-muted-foreground">
          Cole o link direto do arquivo <strong>SMARTEDTV.apk</strong> (começando com https://). Assim que salvar, todos os botões “Baixe o aplicativo aqui” da página passam a apontar para este link.
        </p>
        <div className="space-y-2">
          <Label htmlFor="dl-url">Link de download (https)</Label>
          <Input id="dl-url" type="url" placeholder="https://exemplo.com/SMARTEDTV.apk" value={url} onChange={(e) => setUrl(e.target.value)} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dl-file">Nome do arquivo</Label>
            <Input id="dl-file" value={filename} onChange={(e) => setFilename(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dl-version">Versão (opcional)</Label>
            <Input id="dl-version" placeholder="Ex.: 2.0" value={version} onChange={(e) => setVersion(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dl-notes">Notas da versão (opcional)</Label>
          <Textarea id="dl-notes" rows={3} placeholder="Ex.: Correções de estabilidade e melhorias na navegação." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="cta-button text-sm" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
            {busy ? "Salvando..." : "Salvar e publicar"}
          </button>
          <button type="button" onClick={removeLocal} className="ghost-button text-[10px]"><Trash2 className="h-3.5 w-3.5" aria-hidden />Remover link deste navegador</button>
        </div>
      </form>

      <section className="glass-card mt-6 p-6">
        <h2 className="title-text text-sm">Pré-visualização dos botões</h2>
        <p className="mt-2 text-sm text-muted-foreground">É exatamente assim que os botões aparecem na página inicial:</p>
        <div className="mt-4">
          <DownloadButton />
        </div>
        {release?.download_url && (
          <p className="mt-4 break-all text-xs text-muted-foreground">Link atual: {release.download_url}</p>
        )}
      </section>
    </main>
  );
}
