/**
 * Gera artefatos exclusivos da hospedagem estática (InfinityFree) dentro do
 * diretório de saída do site: robots.txt, sitemap.xml e .htaccess.
 *
 * Usado depois de `STATIC_EXPORT=1 vite build` (veja scripts/static-build.sh).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = process.env.SITE_URL_OVERRIDE || "https://lista-iptv-gratis.kesug.com";
const OUT_DIR = process.env.STATIC_OUT_DIR || "dist/client";
const LAST_MOD = new Date().toISOString().slice(0, 10);

const robots = `# robots.txt - SMARTEDTV | Lista IPTV Grátis
User-agent: *
Allow: /
Disallow: /admin
Disallow: /reset-password

# Google e imagens
User-agent: Googlebot
Allow: /
Disallow: /admin

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><lastmod>${LAST_MOD}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
</urlset>
`;

// InfinityFree roda Apache: garante HTTPS, URLs sem .html, cache e bloqueio do /admin no índice.
const htaccess = `# SMARTEDTV - configuração Apache (InfinityFree)
Options -Indexes
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On

  # Força HTTPS
  RewriteCond %{HTTPS} !=on
  RewriteCond %{HTTP:X-Forwarded-Proto} !https
  RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

  # Remove a extensão .html das URLs (index.html continua servido na raiz)
  RewriteCond %{THE_REQUEST} \\s/+(.+?)\\.html[\\s?] [NC]
  RewriteRule ^ /%1 [R=301,L]

  # /pagina -> /pagina/index.html (prerender com autoSubfolderIndex)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*)$ /$1/index.html [L]
</IfModule>

# Compressão
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css text/xml application/javascript application/json application/xml image/svg+xml
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 10 minutes"
</IfModule>

# Cabeçalhos de segurança
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Erros
ErrorDocument 404 /index.html
`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "robots.txt"), robots, "utf8");
writeFileSync(join(OUT_DIR, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(OUT_DIR, ".htaccess"), htaccess, "utf8");

// Evita que o Apache liste/entregue os arquivos só por existirem.
console.log(`[static] robots.txt, sitemap.xml e .htaccess gerados em ${OUT_DIR}`);
