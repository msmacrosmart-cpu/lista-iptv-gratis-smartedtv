#!/usr/bin/env bash
# Gera build estático pronta para InfinityFree (dist/client) + arquivos extras.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[static] Gerando build estático (STATIC_EXPORT=1)..."
STATIC_EXPORT=1 vite build

if [ ! -f dist/client/index.html ]; then
  echo "[static] ERRO: dist/client/index.html não foi gerado." >&2
  exit 1
fi

node scripts/static-extra-files.mjs

echo "[static] Concluído. Conteúdo pronto em dist/client/"
