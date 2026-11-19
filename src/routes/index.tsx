import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronDown, Tv, Smartphone, ShieldCheck, HelpCircle, Zap, PlayCircle, Download } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";
import { activeReleaseQuery } from "@/lib/release";
import { longTailQuestions, relatedKeywords } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { useQuery } from "@tanstack/react-query";
import secTv from "@/assets/sec-tv.jpg";
import secDownload from "@/assets/sec-download.jpg";
import secDevices from "@/assets/sec-devices.jpg";
import secGuide from "@/assets/sec-guide.jpg";

const TITLE = "Lista IPTV Grátis 2026 - 27 | Baixe o App SMARTEDTV (APK)";
const DESC = "Baixe grátis o aplicativo SMARTEDTV e aprenda como assistir IPTV grátis com sua própria lista IPTV 2026 - 27, de forma simples e segura, em Android e TV Box.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: relatedKeywords.join(", ") },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org", "@type": "SoftwareApplication", name: "SMARTEDTV",
          operatingSystem: "Android", applicationCategory: "MultimediaApplication", inLanguage: "pt-BR",
          offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question", name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        // As 120 dúvidas de cauda longa viram uma lista de perguntas relacionadas,
        // sinalizando o tema para o Google sem respostas duplicadas/genéricas.
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Dúvidas sobre o SMARTEDTV e IPTV grátis",
          description: "120 perguntas de cauda longa sobre download, instalação, lista M3U, compatibilidade e uso do SMARTEDTV.",
          numberOfItems: longTailQuestions.length,
          itemListElement: longTailQuestions.map((q, i) => ({
            "@type": "ListItem", position: i + 1, name: q,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org", "@type": "WebPage",
          name: TITLE,
          description: DESC,
          inLanguage: "pt-BR",
          url: absoluteUrl("/"),
          keywords: relatedKeywords.join(", "),
          about: {
            "@type": "SoftwareApplication",
            name: "SMARTEDTV",
            operatingSystem: "Android",
            applicationCategory: "MultimediaApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
          },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: relatedKeywords.map((k, i) => ({
              "@type": "ListItem", position: i + 1, name: k,
            })),
          },
        }),
      },
    ],
  }),
  component: Index,
});

const sections = [
  {
    img: secTv, alt: "Sala com Smart TV em preto e branco exibindo a navegação do aplicativo SMARTEDTV com categorias Início, Filmes, Séries, Esportes, Notícias, Infantil e canais ao vivo",
    label: "Aplicativo gratuito", title: <>Sua lista IPTV grátis em um <span className="accent-text">app simples!</span></>,
    text: "O SMARTEDTV é um player leve para organizar e reproduzir a lista IPTV que você já tem direito de acessar. Você adiciona o link da sua lista e o app cuida do resto.",
    items: ["Download gratuito", "Interface em português", "Leve e rápido"],
  },
  {
    img: secDownload, alt: "Celular Android baixando o arquivo SMARTEDTV.apk com barra de progresso",
    label: "Download direto", title: <>Baixe o APK oficial em <span className="accent-text">poucos segundos!</span></>,
    text: "O arquivo SMARTEDTV.apk é sempre a versão mais recente publicada pela nossa equipe. Toque no botão, aguarde o download e abra o arquivo para instalar.",
    items: ["Versão sempre atualizada", "Arquivo verificado", "Sem cadastro"],
  },
  {
    img: secDevices, alt: "TV Box, stick de TV, celular e tablet Android compatíveis com o SMARTEDTV",
    label: "Compatibilidade", title: <>Funciona no seu Android, TV Box e <span className="accent-text">tablet!</span></>,
    text: "O app roda em celulares e tablets Android, TV Box e sticks com sistema Android. Em outros aparelhos, verifique se é possível instalar arquivos APK antes de começar.",
    items: ["Celular e tablet Android", "TV Box e stick Android", "Android 5.0 ou superior"],
  },
  {
    img: secGuide, alt: "Pessoa no sofá usando o controle remoto para configurar o aplicativo SMARTEDTV na TV",
    label: "Uso responsável", title: <>Como assistir IPTV grátis com <span className="accent-text">tranquilidade!</span></>,
    text: "O SMARTEDTV não fornece canais nem conteúdo. Use apenas listas e transmissões que você está autorizado a assistir, como listas públicas e gratuitas ou serviços contratados.",
    items: ["Não inclui canais", "Use listas autorizadas", "Seus dados ficam com você"],
  },
];

const why = [
  { icon: Zap, title: "Rápido de instalar", text: "Pronto para usar em poucos minutos." },
  { icon: PlayCircle, title: "Fácil de usar", text: "Menus claros e em português." },
  { icon: Tv, title: "Vários aparelhos", text: "Celular, tablet, TV Box e stick." },
  { icon: ShieldCheck, title: "Uso consciente", text: "Só conteúdo que você pode ver." },
];

const steps = [
  { badge: "Passo 1", title: "Baixe o APK", sub: "No celular ou TV Box", items: ["Toque em “Baixe o aplicativo aqui”", "Aguarde o fim do download", "O arquivo é o SMARTEDTV.apk", "Não precisa de cadastro"] },
  { badge: "Passo 2", title: "Permita a instalação", sub: "Configuração do Android", items: ["Abra o arquivo baixado", "Autorize “fontes desconhecidas”", "Confirme só para este app", "Leva menos de 1 minuto"] },
  { badge: "Passo 3", title: "Instale e abra", sub: "Pronto para usar", items: ["Toque em “Instalar”", "Abra o SMARTEDTV", "Aceite as permissões básicas", "Escolha o idioma português"] },
  { badge: "Passo 4", title: "Adicione sua lista", sub: "Lista IPTV autorizada", items: ["Cole o link M3U da sua lista", "Use só listas autorizadas", "Organize por categorias", "Atualize quando quiser"] },
];

const faq = [
  { q: "O aplicativo SMARTEDTV é gratuito?", a: "Sim. O download do SMARTEDTV.apk é grátis e não exige cadastro. O app é um player: você usa a sua própria lista IPTV grátis ou contratada, desde que tenha autorização para acessar o conteúdo." },
  { q: "O app já vem com canais ou uma lista IPTV?", a: "Não. O SMARTEDTV não fornece, vende nem indica canais. Ele apenas reproduz listas que você adiciona. Procure listas públicas e legais ou use as fornecidas pelo serviço que você assina." },
  { q: "Em quais aparelhos posso instalar?", a: "Em celulares e tablets Android, TV Box e sticks com Android 5.0 ou superior. iPhone e algumas Smart TVs não permitem instalar arquivos APK." },
  { q: "É seguro instalar um arquivo APK?", a: "Baixe o arquivo apenas por este site, onde publicamos sempre a versão oficial. Durante a instalação, o Android pede permissão para fontes desconhecidas; você pode desativá-la depois." },
];

const helpFaq = [
  ["Como atualizar o SMARTEDTV?", "Baixe novamente o APK nesta página e instale por cima da versão atual."],
  ["O download não começa. O que fazer?", "Confira sua conexão, libere espaço no aparelho e tente de novo em alguns minutos."],
  ["Onde encontro uma lista IPTV grátis?", "Prefira listas públicas oficiais, como canais abertos que liberam transmissão online."],
  ["O app funciona sem internet?", "Não. É preciso internet para reproduzir qualquer lista."],
  ["Posso usar em mais de um aparelho?", "Sim. Instale o APK em cada aparelho Android que você usa."],
  ["O SMARTEDTV coleta meus dados?", "O app não pede cadastro. Sua lista fica salva apenas no seu aparelho."],
];

const terms = relatedKeywords;

function Collapsible({ title, children, defaultOpen = false, small = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean; small?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card overflow-hidden">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 p-5 text-left">
        <span className={small ? "title-text text-xs sm:text-sm" : "title-text text-xs sm:text-sm"}>{title}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-silver transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      <div hidden={!open} className="px-5 pb-5 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function Index() {
  const { data: release } = useQuery(activeReleaseQuery);
  return (
    <div className="min-h-screen bg-background">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">Pular para o conteúdo</a>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-[60px] max-w-[1120px] items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2" aria-label="SMARTEDTV - página inicial">
            <span className="flex h-9 w-9 items-center justify-center bg-primary text-primary-foreground"><Tv className="h-5 w-5" aria-hidden /></span>
            <span className="text-base font-extrabold tracking-tight">SMART<span className="text-silver underline decoration-2 underline-offset-4">ED</span>TV</span>
          </Link>
          <a href="#instalar" className="ghost-button py-2 text-[10px] sm:text-xs"><HelpCircle className="h-4 w-4" aria-hidden />Como instalar</a>
        </div>
      </header>

      <main id="conteudo">
        <section className="mx-auto max-w-[1120px] px-5 pb-20 pt-14 sm:pt-24">
          <span className="label-text inline-flex items-center gap-2 bg-primary px-3 py-1.5 text-[10px] text-primary-foreground sm:text-xs"><Zap className="h-3.5 w-3.5" aria-hidden />App gratuito para Android</span>
          <h1 className="title-text mt-5 max-w-3xl text-4xl sm:text-6xl">Lista IPTV grátis 2026 - 27 no app <span className="accent-text">SMARTEDTV!</span></h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">Baixe o SMARTEDTV.apk de graça e assista IPTV grátis com a lista que você tem direito de usar. Instalação simples em celular, tablet ou TV Box Android.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
            <DownloadButton />
            <a href="#instalar" className="ghost-button"><PlayCircle className="h-5 w-5" aria-hidden />Veja como instalar em 4 passos</a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground sm:text-sm">🔒 Grátis · Sem cadastro · Use apenas conteúdo autorizado</p>
        </section>

        <div className="chevron-divider" aria-hidden />

        <div className="mx-auto max-w-[1280px]">
          {sections.map((s, i) => (
            <section key={i} className="grid md:grid-cols-2">
              <div className={`relative min-h-[260px] sm:min-h-[380px] ${i % 2 ? "md:order-2" : ""}`}>
                <img src={s.img} alt={s.alt} loading={i === 0 ? "eager" : "lazy"} width={1280} height={960} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: "var(--gradient-fade)" }} />
              </div>
              <div className="panel-dark flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-14">
                <p className="label-text text-[10px] text-silver">{s.label}</p>
                <h2 className="title-text mt-3 text-2xl sm:text-4xl">{s.title}</h2>
                <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">{s.text}</p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {s.items.map((it) => <li key={it} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 shrink-0 text-silver" aria-hidden />{it}</li>)}
                </ul>
                <a href="#baixar" className="label-text mt-7 inline-flex w-fit items-center gap-2 border-b-2 border-silver pb-1 text-[10px] text-silver transition-colors hover:text-foreground sm:text-xs">Baixe o aplicativo aqui</a>
              </div>
            </section>
          ))}
        </div>

        <section className="mx-auto max-w-[1120px] px-5 py-20">
          <h2 className="title-text text-center text-2xl sm:text-4xl">Por que escolher o <span className="accent-text">SMARTEDTV?</span></h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w) => (
              <div key={w.title} className="glass-card p-6">
                <div className="flex h-11 w-11 items-center justify-center bg-secondary text-silver"><w.icon className="h-5 w-5" aria-hidden /></div>
                <h3 className="title-text mt-4 text-sm">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="instalar" className="scroll-mt-20 mx-auto max-w-[1120px] px-5 pb-20">
          <p className="label-text text-center text-[10px] text-silver">Guia rápido</p>
          <h2 className="title-text mt-3 text-center text-2xl sm:text-4xl">Como instalar o app <span className="accent-text">IPTV grátis</span></h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((p, i) => (
              <div key={p.badge} className={`glass-card relative flex flex-col p-6 ${i === 0 ? "border-silver/70" : ""}`}>
                <span className="label-text absolute -top-3 left-6 bg-primary px-2 py-1 text-[9px] whitespace-nowrap text-primary-foreground">{p.badge}</span>
                <h3 className="title-text mt-4 text-sm">{p.title}</h3>
                <p className="label-text mt-1 text-[10px] text-silver">{p.sub}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.items.map((it) => <li key={it} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-silver" aria-hidden />{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div id="baixar" className="glass-card mx-auto mt-12 flex max-w-2xl scroll-mt-24 flex-col items-center gap-4 p-8 text-center">
            <Smartphone className="h-8 w-8 text-silver" aria-hidden />
            <p className="title-text text-xl sm:text-2xl">Versão mais recente do SMARTEDTV</p>
            {release?.release_notes && <p className="text-sm text-muted-foreground">{release.release_notes}</p>}
            <DownloadButton className="w-full sm:w-auto" />
          </div>
        </section>

        <section className="mx-auto max-w-[820px] px-5 pb-20">
          <h2 className="title-text text-center text-2xl sm:text-4xl">Perguntas frequentes</h2>
          <div className="mt-10 space-y-3">
            {faq.map((f, i) => <Collapsible key={f.q} title={f.q} defaultOpen={i === 0}><p>{f.a}</p></Collapsible>)}
          </div>
        </section>

        <section className="mx-auto max-w-[820px] px-5 pb-24">
          <p className="label-text text-center text-[10px] text-silver">Central de ajuda</p>
          <h3 className="title-text mt-3 text-center text-xl sm:text-3xl">Tudo sobre lista IPTV grátis e o app</h3>
          <p className="mt-3 text-center text-sm text-muted-foreground">Respostas rápidas sobre download, instalação, compatibilidade e uso responsável da sua lista IPTV.</p>
          <div className="mt-8 space-y-3">
            <Collapsible title="Mais dúvidas sobre o SMARTEDTV">
              <dl className="space-y-3">{helpFaq.map(([q, a]) => <div key={q}><dt className="font-semibold text-foreground">{q}</dt><dd>{a}</dd></div>)}</dl>
              <p className="mt-6 text-xs text-silver">120 perguntas frequentes sobre download, instalação, lista M3U, compatibilidade e uso do SMARTEDTV:</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5">{longTailQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
            </Collapsible>
            <Collapsible title="Buscas relacionadas">
              <ul className="flex flex-wrap gap-2">{terms.map((t) => <li key={t} className="border border-border px-2 py-1 text-xs">{t}</li>)}</ul>
            </Collapsible>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LISTA IPTV GRATIS - SMARTEDTV. O app não fornece canais nem conteúdo; acesse apenas o que você está autorizado a assistir.</p>
          <nav className="flex gap-4"><a href="#instalar" className="hover:text-foreground">Como instalar</a><a href="#baixar" className="hover:text-foreground">Download</a></nav>
        </div>
      </footer>

      <a href="#baixar" aria-label="Ir para o download do aplicativo" className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105">
        <Download className="h-6 w-6" aria-hidden />
      </a>
    </div>
  );
}
