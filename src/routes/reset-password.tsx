import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redefinir senha | SMARTEDTV" },
      { name: "description", content: "Crie uma nova senha para o painel do SMARTEDTV." },
      { property: "og:title", content: "Redefinir senha | SMARTEDTV" },
      { property: "og:description", content: "Crie uma nova senha para o painel do SMARTEDTV." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (pw.length < 8) return setErr("A senha precisa ter pelo menos 8 caracteres.");
    if (pw !== pw2) return setErr("As senhas não coincidem.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (!error) await supabase.rpc("mark_password_changed");
    setBusy(false);
    if (error) return setErr("Não foi possível redefinir. O link pode ter expirado; solicite outro.");
    toast.success("Senha redefinida com sucesso");
    nav({ to: "/", replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={submit} className="glass-card w-full max-w-sm space-y-4 p-6">
        <h1 className="title-text text-xl">Nova senha</h1>
        <div className="space-y-2"><Label htmlFor="pw">Nova senha</Label><Input id="pw" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="pw2">Confirme a senha</Label><Input id="pw2" type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
        {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        <button className="cta-button w-full text-sm" disabled={busy}>{busy ? "Salvando..." : "Salvar nova senha"}</button>
      </form>
    </main>
  );
}
