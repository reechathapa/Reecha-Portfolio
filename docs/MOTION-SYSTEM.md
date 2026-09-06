# Reecha: interaction and motion system

## Design position

A warm editorial system: Manrope for precision, Instrument Serif for reflection,
ink and warm paper for hierarchy, and a restrained lime signal for direction.
The page is a strategy portfolio first; the visualizations explain the thinking.
There is no scroll hijacking, custom cursor, autoplay carousel, background video,
or decorative 3D scene.

## Five signature interactions

| Experience | Implementation | What it communicates | Accessible alternative |
| --- | --- | --- | --- |
| Search signal | Lazy native WebGL, a persistent SVG route, discrete Motion-controlled stages | Search → data → insight → growth | Same diagram, buttons, and descriptions without WebGL |
| Search intent engine | Local intent heuristics, GSAP route drawing, Motion tabs/presence | Different needs deserve different content and outcomes | Real input, buttons, roving tab focus, numbered reading order |
| Case-study journey | GSAP ScrollTrigger, short desktop-only pin, chapter activation | Discover → connect → refine | Normal document order, all chapters visible, explicit chapter buttons |
| Performance wall | GSAP SVG drawing and same-command-count path interpolation; Motion counters | Connect discovery, visibility, and useful actions | Keyboard month slider, accurate chart description, full data table |
| Magnetic invitations | React Motion's coupled, two-body `StaggeredMotion` spring | A subtle invitation, with a stable click target | Stationary buttons on touch, low interaction precision, pause, and reduced motion |

Only the hero uses WebGL. For the intent engine, SVG is a better fit: it keeps the
relationship between the four labeled stages clear, has no second GPU context,
and transitions directly in response to a visitor's choice.

## Technology responsibilities

- **Motion for React** (`motion/react`): component reveals, layout-aware project
  filters, project/dialog shared artwork, navigation, tabs, counters, disclosure,
  presence, and press feedback. No unnecessarily elastic reveal presets.
- **GSAP**: hero entrance choreography (art → eyebrow → lines → explanation →
  action → positioning strip), SVG flow drawing, the case narrative, the process
  timeline, and data chart transitions. GSAP never owns basic hover effects.
- **React Motion**: only the two magnetic CTA instances. Its declarative coupled
  spring lets the text follow the moving button surface rather than separately
  following the cursor. The outer hit area never moves. Travel is capped at 7px
  horizontally and 4px vertically; no global pointer listener is installed.
- **CSS**: colors, focus states, simple hover/image scaling, breakpoints, static
  visual fallbacks, and print treatment.
- **Native WebGL**: 19 coherent data routes, not free-floating particles. One
  small shader, static vertex buffers, no textures or 3D engine, max 30fps,
  device pixel ratio capped at 1.5, and a capped backing buffer.

### React Motion compatibility boundary

React Motion 0.5.2 declares an old React peer range. The package override keeps
this app on **React 18.3.1**, the version tested here, rather than installing a
second React. `CoupledSpring.tsx` subclasses the original implementation and
applies the official legacy lifecycle naming convention (`UNSAFE_`) without
mutating the dependency or changing its spring solver. This is a narrow legacy
boundary, not a claim of concurrent-rendering or React 19 compatibility. The app
intentionally does not wrap that legacy implementation in StrictMode. Reevaluate
or replace this isolated interaction before a React major-version upgrade.

Do not introduce React Motion into any other component. Motion for React remains
the primary system; the two libraries never control the same transform property.

## 21st.dev evaluation and adaptation

These resources informed patterns, not the site's identity. No registry code was
copied, no registry install script was executed, and no runtime 21st.dev request
is made.

- The Magnetic Button listing demonstrates bounded attraction for a call to
  action. [1](https://21st.dev/community/components/bundui/magnetic-button)
- The Motion Primitives collection includes animated tabs, magnetic interaction,
  and morphing-dialog primitives. [2](https://21st.dev/@ibelick/library/motion-primitives)

| Pattern evaluated | Retained | Adapted / deliberately rejected |
| --- | --- | --- |
| Magnetic button | Attraction tied to intent to click | A stationary hitbox, capped travel, coupled text/surface spring, no cursor replacement, touch and reduced-motion fallbacks |
| Animated tabs | Shared active background | Reecha spacing/type/colors, native buttons, `tablist` semantics, Arrow/Home/End keys, automatic selection, valid panel association |
| Morphing dialog | Visual continuity from card to detail | Native `<dialog>` for top-layer rendering, focus containment, background inertness, Escape, restored focus, independent readable article scrolling |
| Disclosure | Physical expansion of relevant content | Only useful copy expands; no confetti, shimmer, 3D tilt, or decorative border loops |

Every implementation is original application code, with the same type, color,
spacing, focus, and motion tokens as the rest of the page.

## Section audit

| Section | Meaningful behavior |
| --- | --- |
| Header | Active location indicator, mobile navigation, reading progress, global pause |
| Hero | Cinematic entrance, four-stage signal, contextual descriptions, magnetic action |
| Work | Category filters, layout transitions, image response, complete shared-artwork detail dialogs |
| Intent | Editable query, transparent rule-based interpretation, three intent journeys, sequenced routes |
| Case study | Short pin on desktop, chapter progression and visual activation, explicit jump controls |
| Expertise | Expand/collapse by capability, selectable tool categories and descriptions |
| Process | Scroll-driven progress line and step activation |
| Performance | Counter emphasis, data-series selection, graph transitions, pointer/range exploration, table disclosure |
| About | Typographic portrait interaction, composed text entrance, contact action |
| Notes | Card response, complete readable articles in accessible dialogs |
| Contact | Magnetic invitation, native form validation, local draft, copy/download/edit |

## Reduced motion, mobile, and lifecycle management

- `prefers-reduced-motion` is observed live. It takes precedence over any saved
  preference. The header provides a separate persistent pause switch.
- Pausing or reducing motion removes the WebGL component and magnetic solver,
  reverts GSAP contexts, removes pin spacers, and exposes reveal content.
- Narrow/touch layouts use no hero WebGL, no magnetic attraction, and no pinning.
  The flow uses a compact numbered grid instead of desktop-length connectors.
- WebGL is gated by viewport/pointer capability, `saveData`, device memory when
  available, and CPU concurrency. It is dynamically imported near the hero.
- WebGL rendering stops offscreen or when the document is hidden. The canvas's
  `data-render-state` is a diagnostic for its lifecycle, not user analytics.
- Context loss or graphics failure leaves the persistent SVG and controls usable.
  GPU buffers, shaders, programs, event listeners, ResizeObserver, and the frame
  request are cleaned up on unmount.
- All GSAP contexts, media scopes, and triggers are reverted. Counter controls
  and pending pointer frames are stopped. Modal overflow state is restored.
- Project images are local optimized WebP files; fonts are three local WOFF2
  assets. Below-the-fold images load lazily. Modal code and WebGL are separate
  dynamic chunks. No analytics, remote fonts, or third-party embeds are used.

## Interaction timing

- Hover / press: approximately 0.2–0.3s; press scale 0.98.
- Tabs / small presence: approximately 0.16–0.32s.
- Editorial entrances: approximately 0.6s, 22px maximum reveal travel.
- Hero: overlapping 0.6–1s elements, settled in about 1.8s.
- Charts: 1.2s initial draw, 0.65s series transition.
- Magnetic surface: stiffness 210 / damping 26. Text follower: 310 / 30.
- No wheel event cancellation, forced smooth-scroll engine, or snap scrolling.

## Content integrity

The repository supplied a name but no biography, project history, employment
history, contact address, or verified outcomes. Therefore:

- Verdant, Orbit, and Stillhouse are clearly labeled, self-initiated concept
  studies. Their names, miniature site designs, and generated art are illustrative.
- The performance wall is a transparent 12-month model, labeled at the wall and
  in the accessible table. Percentages agree with the underlying sample data.
- The process section replaces an invented employment timeline.
- The about copy is editable editorial positioning, not a resume or credential
  claim. Do not publish it without the owner's review.
- The contact form creates a local draft. It cannot send anything. If a verified
  address is configured via `VITE_CONTACT_EMAIL`, an explicit mail-app link is
  offered after preparation; otherwise copy and download remain available.
- The field notes are original educational drafts and need editorial approval.
