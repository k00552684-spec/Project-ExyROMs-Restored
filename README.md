# Project ExyROMs

A single-page firmware hub for the Samsung Galaxy Exynos 9611 family, built with Next.js, React, TypeScript, Tailwind CSS, Lucide React and Framer Motion.

> **Catalog note:** The 27 catalog rows, build metadata and displayed SHA-256 value are seeded demonstration content, not verified firmware artifacts or checksums. The download action opens the project Telegram channel rather than a direct package. Confirm the device model, release package and its integrity with the maintainer before flashing.

## Supported device targets

- Samsung Galaxy M31 — `SM-M315F`
- Samsung Galaxy M21 — `SM-M215F`
- Samsung Galaxy F41 — `SM-F415F`
- Samsung Galaxy A51 — `SM-A515F`

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production build:

```bash
npm run typecheck
npm run build
npm run start
```

## Project links

- Community: [Telegram — ExyROMs](https://t.me/ExyROMs)
- Source: [GitHub repository](https://github.com/k00552684-spec/Project-ExyROMs-Restored)
- Existing project page: [projectexyromsrestored.vercel.app](https://projectexyromsrestored.vercel.app/)

The Next.js App Router page is in `app/page.tsx`; the previous standalone `index.html` is retained in the repository as a historical reference and is not the Next.js route.
