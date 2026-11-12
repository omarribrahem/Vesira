import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Set the actual HTTPS site origin when building for publication.
const configuredOrigin = process.env.VASIRA_PUBLIC_ORIGIN;
const publicOrigin = configuredOrigin ? new URL(configuredOrigin).origin : '';
const temporary = !publicOrigin || new URL(publicOrigin).hostname.endsWith('.trycloudflare.com');

// VASIRA v2 — Vite + React. Base './' keeps a `dist` build openable from any path.
export default defineConfig({
  plugins: [react(), {
    name: 'vasira-public-metadata',
    transformIndexHtml(html) {
      const output = html.split('__VASIRA_ORIGIN__').join(publicOrigin)
        .split('__VASIRA_ROBOTS__').join(temporary ? 'noindex, follow' : 'index, follow');
      // A preview without an assigned domain must not claim a false canonical URL.
      return publicOrigin ? output : output
        .replace(/\s*<link rel="canonical"[^>]*>/, '')
        .replace(/\s*<meta property="og:url"[^>]*>/, '');
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${temporary ? '' : `Sitemap: ${publicOrigin}/sitemap.xml\n`}` });
      if (!temporary) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${publicOrigin}/</loc></url></urlset>` });
    },
  }],
  base: './',
});
