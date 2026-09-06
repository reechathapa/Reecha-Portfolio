# Verification — 6 September 2026

## Executed successfully

- `npm run lint` — no errors or warnings.
- `npm run build` — TypeScript and optimized Vite production build pass.
- Full browser suite against the production preview: **27 tests passed**.
- Development suite also passed before the last two edge-case tests were added.
- `git diff --check` — no whitespace errors.

## Browser coverage

Chromium 149 in this Linux sandbox, including a SwiftShader-backed WebGL context.
Desktop at 1440px; touch emulation and layout checks at 320, 390, and 768px.

Verified behaviors include:

- Initial rendering without JavaScript errors or console warnings.
- Project filters and roving tab keyboard control.
- All three project detail views; focus wrapping, Escape, and focus restoration.
- Native navigation out of a dialog places focus at the case-study destination.
- Search-intent categories, editable queries, and transparent local classification.
- Capability disclosures and tool-category/detail interactions.
- Short desktop pinning, chapter progression, and release into native scrolling.
- Chart metric changes, keyboard month exploration, and the complete data table.
- All three complete article views.
- Contact validation, including whitespace-only input; copy, download, and edit.
- Global pause persistence, live reduced motion, and content visibility.
- WebGL offscreen suspension, return to rendering, context-loss fallback,
  unsupported graphics, and low-power device gating.
- Touch navigation, project dialogs, and intent controls.
- No horizontal overflow in the tested narrow layouts and contact dialog.

## Accessibility

Axe's WCAG 2 A/AA and WCAG 2.1 AA checks pass for the full desktop homepage,
the touch homepage, and project, note, and contact dialog types. Text contrast
was corrected in both default and expanded states. The native modal behavior
is augmented with explicit Tab wrapping and focus restoration.

These are automated checks, not a declaration of full accessibility conformance.
Real screen-reader review and Safari/Firefox/physical-device testing remain
recommended before public release.

## Build observations

- Initial JavaScript chunks: approximately **169 kB gzip** combined.
- Main CSS: approximately **15 kB gzip**.
- Optional WebGL chunk: approximately **2.1 kB gzip**.
- On-demand dialog chunk: approximately **3.8 kB gzip**.
- Exactly three local WOFF2 font assets, approximately **68 kB** combined.
- Two local WebP editorial images, approximately **249 kB** combined.
- No remote runtime font, image, analytics, or API requests.

Bundle sizes are build output, not real-device performance measurements. No
Lighthouse score or Core Web Vitals result is claimed. The GPU path is capped
and visibility-gated; validate frame timing on representative physical devices
when a deployment target is available.

## Publication checklist

- [ ] Approve or replace the editorial biography and field notes.
- [ ] Replace concept brands with permissioned real work if desired.
- [ ] Keep sample-data disclosures unless replacing them with verified results.
- [ ] Configure a verified contact address in `VITE_CONTACT_EMAIL`.
- [ ] Set final canonical/social metadata once the public domain is known.
- [ ] Run human accessibility and physical-device reviews.
