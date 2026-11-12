# VASIRA

Bilingual English/Arabic landing page for VASIRA, a digital marketing agency serving brands in Egypt and Saudi Arabia.

Built with React, TypeScript, Vite, GSAP and CSS. Includes responsive marketing photography, a draggable lighthouse with soft light and slow automatic rotation, an accessible menu, and optional ocean ambience.

## Run locally

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

## Check and build

```sh
npm run typecheck
npm run build
npm run preview
```

The production site is generated in `dist/`. Preview serves it at `http://localhost:4173`.

## Production metadata

Set `VASIRA_PUBLIC_ORIGIN` to the actual public HTTPS origin before building:

```sh
VASIRA_PUBLIC_ORIGIN=https://your-domain.example npm run build
```

PowerShell:

```powershell
$env:VASIRA_PUBLIC_ORIGIN = 'https://your-domain.example'
npm run build
```

This generates absolute canonical/social URLs, indexing metadata and a sitemap. Without an origin, the build remains a noindex preview and omits canonical/og:url declarations. No deployment domain is assumed or hardcoded. Deploy the contents of `dist/` to a static host.

## Features

- English/Arabic switching with saved language preference and RTL layout.
- Language, ocean-sound control and project enquiry action inside the menu.
- Locally hosted English/Arabic WOFF2 fonts with included OFL licenses.
- SVG/ICO favicons, Apple touch/app icons, standalone manifest and English/Arabic social-sharing images.
- Ocean-style ambience enabled by default but audible only after a permitted user gesture. Visitors can mute it; backgrounding the page pauses it.
- Reduced-motion support, visible keyboard focus, native scrolling and pinch zoom.
- Home-screen standalone launch metadata. No offline/service-worker functionality is claimed.

## Source and assets

- `src/` — components, typed locale content and shared styling.
- `public/images/marketing/` — six illustrative AI-generated marketing scenes with responsive JPEG variants; they do not depict actual VASIRA staff or client work.
- `public/fonts/` — self-hosted fonts and their licenses.
- `public/audio/` — original procedurally synthesised ocean-style loop.
- `public/icons/`, `public/social/` — app/browser icons and sharing images.
- `vite.config.ts` — build configuration and metadata generation.

The earlier prototype, previous site version, authoring documents, test evidence, dependencies and generated build output are kept outside the published repository content. Real-device Safari browser chrome and safe-area behaviour require physical-device confirmation.

## Third-party notices

Adapted React Bits components are included as part of this website. Their upstream notice is retained in `THIRD_PARTY_NOTICES/ReactBits-LICENSE.md`. Font licenses are included under `public/fonts/`. Dependency packages retain their own licenses; no project-wide open-source license is implied.
