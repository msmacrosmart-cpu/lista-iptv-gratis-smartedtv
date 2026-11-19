# Lista Iptv Gratis Smartedtv

Goal: Recreate the reference website https://listadecanais-smartedtv.vercel.app/ as a responsive promotional website for LISTA IPTV GRATIS - SMARTEDTV, aimed at Brazilian visitors whose primary action is downloading the SMARTEDTV.apk app. Emotion: trustworthy, simple, accessible and helpful; friendly Brazilian Portuguese, clear guidance, no exaggerated promises. Flow: landing page → understand the app and compatibility/how it works → click “Baixe o aplicativo aqui” → download the current APK from the admin-managed file or URL. Pages: home/landing page matching the reference site's page structure, content hierarchy, spacing, typography, components and desktop/mobile formatting as closely as possible; secure /admin login and APK management screen. Use the reference site as the visual source of truth; inspect it before building, preserve its layout and responsive behavior, changing the orange palette to a refined grayscale system (charcoal, graphite, silver, off-white) with accessible contrast. Features: prominent “Baixe o aplicativo aqui” CTA; download delivery from the latest APK uploaded to Supabase Storage or an admin-configured direct URL; admin can upload/replace APK, set download URL, filename, version and short release note; validate file/link and show clear loading, success and error feedback. Admin: Supabase Auth-protected /admin, no public admin registration; provision initial admin username admin1997 with temporary password admin577 securely server-side (never expose credentials or secrets in client code/database-readable frontend); require password change at first login and allow secure password reset. Roles: visitor can browse/download; authenticated admin can manage APK details only. Data: app_releases(id, filename, storage_path, download_url, version, release_notes, is_active, created_at, updated_at); keep only one active release, with secure Supabase Storage policies and admin-only write access. States: loading, empty/no APK configured, invalid link/file, upload progress, success, download unavailable, login error and authenticated/unauthenticated. SEO/content: rewrite all visible copy and metadata in natural Brazilian Portuguese for “lista IPTV grátis”, “IPTV grátis”, “lista IPTV 2026 - 27 grátis”, “como assistir IPTV grátis” and relevant long-tail variations; inspect the reference and preserve the same number of headings/sections, approximate word count, keyword phrase count and placement pattern while replacing the subject matter; do not keyword-stuff, make unverifiable claims, promise channels/content, or imply unauthorized access. Explain that users should access only content they are authorized to view. Add unique title/meta description, semantic headings, canonical, Open Graph, descriptive alt text, internal links where relevant, sitemap.xml and robots.txt. Design System: reproduce reference typography scale, widths, alignment, section order, card/button shapes and spacing; grayscale palette instead of orange; restrained hover/focus transitions; mobile-first fidelity to the reference at common phone, tablet and desktop widths; keyboard access, visible focus and WCAG AA contrast. Content: complete, persuasive, useful Portuguese copy; real CTA labels and download guidance, no lorem ipsum or dead buttons. Stack: Vite + React + shadcn/ui + Tailwind CSS + Supabase. Scope: prioritize faithful responsive landing page and secure end-to-end APK publishing/download flow; defer analytics, subscriptions, playlists, streaming player and unrelated features. Success: visitors can understand the SMARTEDTV app and download the current APK smoothly on desktop and mobile, while the owner can securely replace the APK or its direct link in /admin.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lista-iptv-gratis-smartedtv.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5a2e9d8e-da92-4e0a-a5c6-e9e516950b92).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
