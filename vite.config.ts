import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * STATIC_EXPORT=1 gera um site 100% estático (HTML pré-renderizado) em dist/client,
 * pronto para hospedagem compartilhada (InfinityFree, cPanel, etc.), onde não há
 * Node/Cloudflare Workers para rodar o SSR.
 *
 * Sem essa variável o build continua idêntico ao de antes (nitro/Cloudflare),
 * para não quebrar a publicação pelo Lovable.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

export default defineConfig({
  ...(isStaticExport ? { nitro: false as const } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isStaticExport
      ? {
          prerender: {
            enabled: true,
            crawlLinks: true,
            autoSubfolderIndex: true,
            failOnError: true,
            concurrency: 2,
          },
        }
      : {}),
  },
  vite: {
    server: { allowedHosts: true },
    preview: { allowedHosts: true },
  },
});
