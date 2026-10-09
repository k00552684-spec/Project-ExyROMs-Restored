# Project ExyROMs — Implementation Plan

## Product and implementation

Build a single-page, responsive Next.js App Router website for Project ExyROMs, a community firmware hub for Samsung Galaxy Exynos 9611 devices. This repository currently contains a standalone HTML page; add a typed Next.js application while retaining that original file for historical reference. The app is entirely client-side for this iteration: seeded catalog records power searching, filtering, selection, the build inspector and flashing-guide stepper. Clipboard controls use the browser Clipboard API. No backend, account system, package hosting, or verified release manifest is present.

The catalog has 27 records to satisfy the requested UI demonstration, but those records, sizes, variants and displayed example hashes are not verified firmware artifacts. Make that status explicit in the interface. Link the package CTA and Telegram buttons to the existing official project Telegram channel; link GitHub to this repository. Do not claim a package is available or a sample hash is a valid integrity check. The flashing guide is illustrative and must be accompanied by a device/build-specific verification and data-loss warning.

## Project structure

- `app/layout.tsx`: page metadata, font loading and root document shell.
- `app/page.tsx`: interactive client page; typed sample catalog, filters/search, selected build inspector, clipboard actions and flashing stepper.
- `app/globals.css`: dark/lime design tokens, terminal and card styling, responsive behavior and reduced-motion handling; Tailwind CSS is initialized and used alongside focused component styles.
- `postcss.config.mjs`, `next.config.ts`, `tsconfig.json`, `package.json`: Next.js, Tailwind CSS v4 and TypeScript setup.
- `public/manus-routes.json`: route declaration for the single `/` page.
- `public/favicon.svg`: simple project mark.
- `README.md`: local development, stack and catalog safety notes.
- `plan.md` and `TODO.md`: implementation decisions and acceptance-clause tracking.
- Existing `index.html` and image assets remain in place; Next.js serves the new App Router page.

## Design description

- **Design movement:** Developer Dark Mode, borrowing the visual discipline of Vercel and Linear rather than skeuomorphic device mockups.
- **Core principles:** high information density without clutter; sharp one-pixel borders; clear hierarchy through type and whitespace; interactions that feel immediate and keyboard accessible.
- **Color philosophy:** true black is the quiet canvas; white carries essential information; grays distinguish supporting metadata; Electric Lime (`#CCFF00`) is reserved for active, supported and primary-action states.
- **Layout paradigm:** a wide editorial hero flows into a two-column command center, then hardware cards and a split guide/terminal stepper. It collapses to a single reading column on narrow screens.
- **Signature elements:** a low-contrast coordinate grid fading at the hero edges; a pulsing lime kernel-status point; JetBrains Mono labels and terminal surfaces.
- **Interaction philosophy:** search and filter results update immediately; selection is reflected in a persistent inspector; guide steps are explicitly selectable; copy actions announce success accessibly.
- **Animation:** short, low-amplitude Framer Motion entrances and selection transitions; respect `prefers-reduced-motion`; no continuous high-motion effects beyond the small status pulse.
- **Typography system:** Inter for UI and headings, JetBrains Mono for identifiers, versions, terminal commands and hashes. Large tight-tracked hero text; compact uppercase mono labels for metadata.
- **Brand essence:** a hardware-specific firmware command center for Exynos 9611 enthusiasts, prioritizing clarity over hype. Personality: precise, technical, composed.
- **Brand voice:** assertive, concise and developer-facing. Example lines: “Unleash Exynos.” and “Compile. Flash. Dominate.”
- **Wordmark & logo:** textual `[ ExyROMs ] // 9611` wordmark with a lime bracket/processor accent; use the same motif for the favicon.
- **Signature brand color:** Electric Lime (`#CCFF00`).

## Technical constraints

Use current stable Next.js, React, Tailwind CSS v4, Lucide React and Framer Motion dependencies with a committed lockfile. The website must not invent valid direct firmware links or checksums; the existing GitHub repository has no published releases, so direct users to the existing Telegram community and visibly mark the seeded catalog as illustrative. The existing `index.html` remains untouched while the Next.js route becomes the framework entrypoint. No deployment or publishing is requested; deliver changes through a feature branch and pull request for review.
