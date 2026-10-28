# Mini design and component guide

This describes the current static demo, not a new framework. Use it to keep manual or coding-assistant edits consistent. It does not generate illustrations automatically or verify medical instructions.

## Tone and content

Write warm, direct instructions with everyday words. Use sentence-case titles such as “Gather your supplies” and “Updated medication plan.” Avoid stacked title prefixes, excessive colons, design commentary inside steps and promises of treatment success. Keep the sample notice concise. Phases group a clinician's changing plan; they are not a universal treatment schedule or a record of injections taken.

Use the source materials for the actual medication and device. Preserve source distinctions and links; do not blend different devices' techniques. Personal doses, times, dates, vial counts and other prescribed quantities remain placeholders in this demo. Source-based details belong in the practical steps; adaptation guidance belongs in “Make it your own,” not between injection steps.

## Palette and typography

The CSS variables in `styles.css` are the source of truth:

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f7f6f0` | Warm page background |
| `--surface` | `#fffefa` | Reading panel and card surfaces |
| `--ink` | `#273b38` | Main text and outlines |
| `--muted` | `#54655f` | Supporting text |
| `--teal` | `#285b51` | Actions and current state |
| `--line` | `#cbd6cd` | Borders and dividers |
| `--blue` | `#e3ebed` | Equipment illustration panels |
| `--yellow` | `#edc761` | Illustration and confetti accent |
| `--warn` | `#f6ead8` | Existing source-warning treatment |

Headings use Georgia with serif fallback; body copy uses the system sans-serif stack. Desktop body text is 18px with 1.5 line height, dropping to 17px on phones. The main heading scales from 32px to 54px. Use the existing CSS classes rather than adding competing font rules. Cards have thin borders, rounded corners and quiet flat fills; avoid glossy effects or heavy shadows.

## Illustration language

Use the existing airline safety-card style: simplified recognizable silhouettes, flat muted colors, dark rounded outlines and clear external labels. Equipment SVGs use a `400 × 230` viewBox, a default 1.7-unit stroke and rounded line joins/caps; individual parts commonly use 2-unit strokes. Keep relative proportions and distinctive parts grounded in reviewed sources, not guessed internal geometry. Do not reproduce fine packaging text.

Use clear photos only after inspecting them. Crop or cover names, prescription labels, barcodes, IDs and personal details before sharing. Use only materials the contributor has permission to use; link to source videos rather than copying them into the app. Medication and diluent must be labeled distinctly, never identified only by color.

Technique diagrams have their own viewBoxes and accessible titles/descriptions. Preserve skin baselines, measured angles and source/device context. Do not infer depth, grip, needle length or delivery sequence from an equipment drawing. Read `CONTENT-SOURCES.md` before modifying these diagrams.

## Existing components

- **Home introduction:** a warm-white panel with a thin border, matching 18px card corners and the shared homepage reading measure below. Desktop padding is 24px; phones use 20px. Its 40px desktop/32px phone bottom gap separates the introduction from the phase section. Walkthrough intros remain unboxed.

- **Phase cards:** current sample first, earlier sample alongside it on desktop. Keep the status eyebrow, short sentence-case title, medication artwork and “View instructions” button. Explain changes in body text. Desktop card gaps are 24px; give headings 12px above and 16px below, and align action buttons to the bottom of each card. Phase sections have a 32px bottom gap (28px on phones).
- **Supply cards:** equipment artwork above a separate white label footer. `.supply-label` centers text horizontally and vertically, with symmetric padding, a 72px desktop minimum and 66px phone minimum. Wrapped labels stay centered. Never center the entire card in place of its footer. Selection outlines and `aria-pressed` communicate optional selection.
- **Step cards:** illustration beside practical copy on desktop, above it on phones. Dose/schedule placeholders sit above reading progress. Use 32px desktop copy padding and 24px on phones (the existing compact diagram override remains). Source details open in place; external links open only on a deliberate click.
- **Technique diagrams:** preserve legible external labels and sufficient space around angle markers. Avoid overlaps with equipment or other annotations.
- **Medication transitions:** explicit end-of-guide text, next medication illustration and Start button. Back restores the prior boundary. Starting the next guide does not double the celebration.
- **Make it your own:** separate home section with collapsible adaptation guidance. Use the shared homepage inset below and a compact disclosure-to-list gap. Do not turn the medication walkthrough into developer setup instructions.

## Homepage type and reading columns

These rules are scoped to `main.is-home`; detail pages keep their existing typography and layout.

- Main narrative copy (intro, phase explanation, adaptation paragraphs and list): 16px/26px on phone and desktop. Card body copy uses the same size; supporting card copy is 14px/22px. Status eyebrows remain 12px.
- “Follow the plan by phase” and “Make it your own” are sibling h2 sections: Georgia 32px/40px on desktop, 28px/35px on phones. Phase-card h3 titles use 28px desktop/26px phone. The main page title retains its existing larger scale.
- “How to adapt the guide” is a disclosure control, not another section heading: system sans-serif, 16px/26px, weight 600, with a 44px minimum target.
- **One responsive parent:** `main.is-home` has a 1000px border-box maximum, including 28px desktop side padding. Every major homepage section (intro, phase overview, phase-card group and adaptation panel) is `width:100%` of that same content area. The header bar uses the same 1000px maximum. At the desktop cap, all section outer widths are 944px. Do not give any future homepage section a separate narrower maximum.
- **No independent prose cap:** paragraphs and disclosures fill their section's available inner width. Remove local `ch`, `rem` or pixel text caps on homepage content. A 25px desktop/21px phone inset aligns narrative text across sections; the intro's border plus padding counts toward that inset. The phase overview uses an unboxed section with the same inset. The numbered list retains its 24px indent and ends at the paragraph's right boundary.
- These sections grow and stop together as the viewport changes. On phones the parent uses 16px side padding, and phase cards stack. Individual phase cards still share the group width according to the existing two-column layout; they are not each full-page width on desktop.
- Text stays 16px/26px, left-aligned and naturally ragged-right. Keep the existing headline and heading hierarchy. No justification or manual line breaks force equal line endings.

## Responsive behavior and accessibility

Homepage main/header wrappers are capped at 1000px; detail-page main content remains capped at 1180px. Supply columns change from four to three at 850px and two at 600px. Phase cards stack at 700px. Medication step cards stack at 600px. Preserve text wrapping and check at 320, 390, 768 and 1280px without horizontal overflow.

Keep semantic headings, visible keyboard focus, skip navigation, tab-arrow navigation, modal focus containment and focus return. Buttons are generally at least 48px high; compact tools/source links use 44px targets. Current medication is stated in text, not color alone. Informative technique SVGs need accessible titles and descriptions; decorative equipment art has an adjacent label.

Optional checks never block Next. All state remains in memory under the demo namespace and resets on reload or phase change. No storage, accounts, analytics or administration log. Confetti uses 24 particles and a 1.10-second animation, with cleanup after 1350ms. Reduced motion retains encouragement text without animation. Back/load must not celebrate, and animation must not block clicks. Empty encouragement takes no layout space; the footer keeps a consistent 32px separation.

## Editing map and verification

| File | Edit here for |
| --- | --- |
| `example-plan.json` | Sample phases, medication steps, source references and placeholders |
| `app.js` | Rendering, homepage/adaptation copy and navigation behavior |
| `styles.css` | Tokens, components and responsive layout |
| `assets/illustrations.json` | Original reviewed SVG equipment and technique diagrams |
| `index.template.html` | Page structure, persistent notice, About panel and landmarks |
| `celebration.js` | Encouragement and motion behavior |
| `build.py` | Self-contained output and script-hash CSP generation |

Rebuild with `python3 build.py`; never hand-edit generated `index.html`. Run `python3 tests/privacy.py` and `node tests/browser.mjs` using the local browser setup in README. Check every new tracked file and history for private content, review source links, inspect mobile/desktop screenshots, and exercise phase switching, Next/Back, optional checks, reset, keyboard use and reduced motion. Keep test screenshots outside this repository.

Port generic improvements deliberately: inspect the change, manually copy only sanitized UI/artwork, leave private data and history behind, then rebuild and test. No automatic mirroring. Publication is a separate explicit approval step.
