# Reecha Thapa — Search, with purpose.

An editorial, interactive SEO strategy portfolio built from the repository's
original one-line brief. Warm paper, ink, purposeful lime, and five connected
signature interactions — not a collection of animation demos.

## Run locally

Requires **Node.js 22.17+** (or a current supported Node 24 release).

```sh
npm ci
npm run dev
```

The development server binds to `0.0.0.0:5173` and accepts Arena's `.e2b.app`
preview hosts. Browser-facing assets and requests are same-origin. There is no
backend, remote-font request, analytics service, or API key requirement.

```sh
npm run build     # TypeScript check + optimized static site in dist/
npm run preview   # Serve the production build on 0.0.0.0:4173
npm run lint      # TypeScript/React hook lint checks
npm test          # Functional, data, motion, responsive, and axe checks
```

The test suite prefers an installed Playwright Chromium. Run
`npx playwright install --with-deps chromium` for the standard browser. In
restricted Linux x64 sandboxes, it can instead use the dev-only
`@sparticuz/chromium` package; the test helper unpacks required libraries to a
temporary directory. None of those binaries enter the site bundle or Git.
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can point to another installed browser.

## What's implemented

- A GSAP-led hero entrance and a small, lazy native-WebGL search signal.
- An editable, **local and rule-based** search-intent explorer with three journeys.
- Filterable project concepts and shared-artwork detail dialogs.
- A short, desktop-only ScrollTrigger case-story pin; normal touch/reduced-motion
  document flow and direct chapter controls.
- Capability disclosures, interactive tool categories, and a scroll-driven process.
- Animated, selectable performance series with a keyboard month slider and a
  complete accessible data table.
- Original field notes with full article views.
- A coupled-spring magnetic CTA, deliberately confined to two invitations.
- A native-dialog project-brief builder with validation, copy, download, and edit.
- Persistent global animation pause, live reduced-motion preference handling,
  WebGL capability gating, offscreen/hidden-tab suspension, and static fallbacks.
- Local optimized WebP art and three self-hosted WOFF2 font files.

## Before publishing: review the content

**No actual projects, employment history, contact details, portrait, or business
results were supplied.** The site does not pretend otherwise:

- **Verdant, Orbit, and Stillhouse are fictional concept brands**, labeled as
  independent studies. Their original miniature website designs and generated
  editorial images are illustrative, not screenshots of client engagements.
- **The performance wall is a sample model, not verified client data.** Its
  percentages agree with its disclosed dataset. Keep the visible disclosure until
  you replace it with verified, permissioned results.
- The process timeline is a working approach, not invented employment experience.
- The positioning/about copy and field notes are editable editorial drafts and
  should be approved by Reecha before publication.
- No social profile or email address has been guessed.

### Configure an actual contact address

Copy `.env.example` to `.env.local` and set a verified address:

```dotenv
VITE_CONTACT_EMAIL=your-verified-address@example.com
```

The brief builder then offers **Open email app** after preparing a message.
Without configuration it honestly offers copy/download only. This is not a
server-side form and it never claims to have sent a message. The form does not
store personal details or make network requests. `VITE_*` values are public;
never put secrets in them.

### Editing guide

| Change | File |
| --- | --- |
| Hero positioning and signal stages | `src/components/Hero.tsx` |
| Project concepts and proposed outcomes | `src/data/projects.ts` |
| Project art direction | `src/components/Work.tsx`, `public/images/` |
| Search-intent templates / heuristic | `src/data/intents.ts` |
| Case-story chapters | `src/components/CaseStudy.tsx` |
| Capabilities and tool descriptions | `src/components/Capabilities.tsx` |
| Process and about copy | `src/components/Process.tsx`, `About.tsx` |
| Sample chart data | `src/data/performance.ts` |
| Full article copy | `src/data/notes.ts` |
| Brief form | `src/components/Overlay.tsx` |
| Design tokens and responsive layout | `src/styles/global.css` |
| Font subsets | `src/styles/fonts.css` |
| Title and sharing description | `index.html` |

## Architecture and technology choices

React 18 + TypeScript + Vite. Motion for React is the primary component animation
system. GSAP owns multi-element sequences, scroll choreography, and SVG charts.
React Motion owns only the coupled magnetic spring. Native WebGL is isolated in
its own dynamic chunk; the intent engine uses SVG instead of opening a second
GPU context.

React Motion is an intentionally narrow legacy integration. React is pinned to
18.3.1, a package override avoids installing a second React, and `CoupledSpring`
applies the lifecycle-name compatibility adjustment without changing its solver.
Do not upgrade React blindly or spread the legacy dependency across components.

The [motion design and responsibility audit](docs/MOTION-SYSTEM.md) documents the
21st.dev patterns evaluated, adaptation decisions, timings, cleanup, responsive
behavior, and content integrity policy.

## Deployment

Deploy the contents of `dist/` to a static host at its root path (for example,
Vercel or Netlify). No server process or environment secret is required in
production. For a subdirectory deployment, configure Vite's `base` and update the
root-relative public-image URLs to that deployment base. Add the final canonical
URL and absolute social-image metadata once a verified public domain exists.

## Quality checks

The browser suite covers project filtering, focus containment/restoration,
Escape dismissal, all article views, intent classification, capabilities/tools,
case pin release, chart keyboard controls/data tables, contact validation and
copy/download, persisted pause, reduced motion, WebGL pause/context loss/failure,
and 320/390/768px layouts. Axe checks the complete desktop and touch pages plus
the three dialog types against WCAG 2.1 AA rules. Automated checks supplement,
not replace, manual keyboard, screen-reader, and device review.

The runtime smoke test rejects uncaught exceptions, console errors, and unexpected
warnings. It allows only Chromium's specific `GPU stall due to ReadPixels` driver
warning seen during headless CI capture; other WebGL warnings still fail the test.
CI also uses Playwright's GitHub reporter to annotate the actual failing assertion,
in addition to retaining the HTML report, screenshots, and traces on failure.
