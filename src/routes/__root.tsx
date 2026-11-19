import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "../components/ui/sonner";

// Snippet de popup do provedor (vapid-size). Inline de propósito: o código usa
// document.currentScript para se auto-injetar no ponto correto do documento.
const AD_POPUP_SNIPPET = `(function(mzrqirn){
var d = document,
    s = d.createElement('script'),
    l = d.currentScript || d.scripts[d.scripts.length - 1];
s.settings = mzrqirn || {};
s.src = "//vapid-size.com/cNDy9w6.bc2p5/lzSjWiQg9kNoz/Y/0/MFjGAmw/MKSb0u3ON/jOQuy_M_DsA/1i";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado por aqui. Você pode tentar atualizar ou voltar ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "IPTV Grátis 2026 - 27 | SMARTEDTV - Baixe o App APK" },
      { name: "description", content: "Baixe grátis o SMARTEDTV.apk, instale no celular ou TV Box Android, abra o app, escolha usar com ou sem anúncios e assista IPTV grátis na hora." },
      { name: "author", content: "SMARTEDTV" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "IPTV Grátis 2026 - 27 | SMARTEDTV" },
      { property: "og:description", content: "Baixe o SMARTEDTV.apk grátis, instale e assista com ou sem anúncios no Android e TV Box." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "IPTV Grátis 2026 - 27 | SMARTEDTV" },
      { name: "twitter:description", content: "Baixe o SMARTEDTV.apk grátis, instale e assista com ou sem anúncios no Android e TV Box." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      // Pré-conexão com as redes de anúncio: reduz latência do script e evita
      // que a política de referrer bloqueie a entrega do criativo.
      { rel: "preconnect", href: "https://vapid-size.com" },
      { rel: "dns-prefetch", href: "https://vapid-size.com" },
      { rel: "preconnect", href: "https://fluffy-machine.com" },
      { rel: "dns-prefetch", href: "https://fluffy-machine.com" },
      { rel: "preconnect", href: "https://massivesalad.com" },
      { rel: "dns-prefetch", href: "https://massivesalad.com" },
      { rel: "preconnect", href: "https://www.massivesalad.com" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="91f28fd655ba3da2977584b03691260be2b0a07c" content="91f28fd655ba3da2977584b03691260be2b0a07c" />
        <HeadContent />
      </head>
      <body>
        {children}
        {/* Popup: script inline no HTML, como o snippet original do provedor.
            Precisa ser inline porque o código usa document.currentScript. */}
        <script
          data-ad-provider="popup-inline"
          dangerouslySetInnerHTML={{ __html: AD_POPUP_SNIPPET }}
        />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
