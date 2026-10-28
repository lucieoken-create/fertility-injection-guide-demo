# Fertility injection guide — portfolio demo

Made by [Lucie Oken](https://www.linkedin.com/in/lucieoken/) at [hijinx](https://hijinx.studio).

[Open the live demo](https://lucieoken-create.github.io/fertility-injection-guide-demo/) · [View the source on GitHub](https://github.com/lucieoken-create/fertility-injection-guide-demo).

An illustrated guide that makes fertility injection instructions easier to follow. Fictional phases demonstrate an initial medication plan and an updated plan with an added medication. Dose, schedule and mixing-quantity fields are placeholders; practical device-specific steps link to public demonstrations and manufacturer instructions. No personal treatment records are included. This is not a personal prescription and has not been medically validated.

## The design problem

Dense injection instructions can be hard to navigate when a task has several parts and the plan changes. The goal of this demo is a more cohesive process experience: a visible phase structure, recognizable equipment illustrations, short cards and explicit boundaries between medication guides and phases.

## Design and features

- Flat vector illustrations inspired by the clarity of airline safety cards, with readable external labels.
- A featured example beside an earlier example, preserving context without claiming a history of doses taken.
- Optional supply selections and reading checks that never gate navigation.
- Medication transitions with large illustrations and an explicit Start button.
- Phone and desktop layouts, keyboard navigation, focus management and accessible current-state text.
- Brief encouragement and confetti that respect reduced motion. No celebration on Back or reload, and no duplicate burst when starting the next guide.
- Self-contained output: no accounts, analytics, third-party scripts, embedded videos or automatic remote requests. Public source links open only on deliberate click.

Dose, schedule, effective-date, vial-count and diluent-amount fields are deliberate placeholders. General preparation and injection guidance retains its medication/device context; see CONTENT-SOURCES.md for scope and limitations. Medication names identify example interface sections; they do not form a prescribing recommendation. Equipment illustrations are generic identifiers, not device specifications.

## How Codex supported the build

Codex (via Dot) supported iterative layout development, code-native SVG refinement, state and navigation design, accessibility fixes, responsive browser checks and privacy scans. Human review shaped the visual direction and interaction decisions. This was a collaborative design/build workflow, but NOT a clinical review or medical advice.

## Run locally

Requires Python 3.9 or newer. No package installation or build dependencies are needed.

```sh
python3 build.py
python3 tests/privacy.py
python3 serve.py
```

Open **http://127.0.0.1:8766/**. The preview binds only to loopback and serves only the generated HTML. This local preview is separate from the published portfolio demo.

For browser QA, run an isolated Chrome instance with remote debugging on port 9225, then run the dependency-free browser test with Node 22 or newer:

```sh
node tests/browser.mjs
```

Optional arguments: `--cdp http://127.0.0.1:9225`, `--url http://127.0.0.1:8766/`, and `--output /tmp/portfolio-demo-review`. Test screenshots are written outside this repository.

## Editing guidance

Coding assistants should start with [AGENTS.md](AGENTS.md) and the [mini design and component guide](DESIGN-GUIDE.md). The guide records the existing colors, typography, illustrations, components, responsive behavior and verification steps. It supports consistent edits; it does not generate content automatically or establish medical correctness.

## File structure

- `example-plan.json`: fictional phase, supply and card content, including dose/schedule placeholders.
- `app.js`: reusable rendering, navigation and optional in-memory state.
- `styles.css`: presentation and responsive behavior.
- `assets/illustrations.json`: original, reviewed generic vector assets.
- `celebration.js`: motion-aware encouragement.
- `index.template.html`: document structure, demo labeling and accessibility landmarks.
- `build.py`: embeds the reviewed content and assets into a fresh `index.html` with a script-hash content security policy.
- `serve.py`: local preview with an explicit route allowlist.
- `tests/`: privacy and functional verification.
- `CONTENT-SOURCES.md`: public-source mapping and boundaries of the practical content.
- `AGENTS.md`: starting instructions for coding assistants.
- `DESIGN-GUIDE.md`: current visual conventions, components and editing rules.

The in-memory state namespace is `fertility-portfolio-demo-v1`. The demo never reads or writes browser storage, and every reload starts clean. Different examples also get separate state keys. No medication administration history is collected.

## Adapting your own copy

The source is public for inspiration and adaptation. For a personal adaptation, begin with a clean private working copy before adding any personal plan or medical information. A community-template license has not been selected yet. Replace example medicines, devices, prescribed doses, times and phase changes with clinician-provided instructions. Use clinic-provided instructions and video links with ChatGPT/Codex or Claude to adapt content. Clear equipment photos can inform matching illustrations: crop or cover names, prescription labels, barcodes, IDs and other personal details before sharing them. Only share materials you have permission to use, and link to videos rather than republishing them. Use the mini design guide to keep edits consistent, and review every step and illustration against clinician-provided materials. Never commit real medical records or personal treatment details to a public repository. A public fork is not private storage.

## Future community template

An updated template is planned, but this is an earlier demonstration rather than a clinical configuration tool. Before community release, content contracts, validation, review responsibilities and safe configuration boundaries need further design and checks. It is not ready for unsupervised clinical reuse.

Generic improvements should move through a deliberate review process:

1. Review the proposed interface or illustration improvement separately from any private content.
2. Manually port only sanitized, relevant changes into this clean project. Never merge private Git history, copy source records, or mirror repositories automatically.
3. Keep fictional configuration separate from reusable code. Rebuild, scan every file and history, and run functional and visual checks.
4. Review the exact public payload and explicitly approve publication.

A shared core can be explored later. There is no automatic synchronization in this demo.

## Publishing this demo

The public demo uses GitHub Pages in this repository. The `main` branch contains the clean, reviewed source; `gh-pages` contains only the generated `index.html`. The website does not serve working notes, tests or source files.

For a later update, rebuild and run the privacy and browser checks, review the exact changes, then explicitly approve publication. Push reviewed source to `main` and update `gh-pages` with the matching generated HTML. A push to `main` alone does not update the website. Keep the two versions in sync deliberately; do not copy private content or private Git history into either branch.

## License and release status

Published as a portfolio demonstration. No open-source license has been selected or added. A license choice will be proposed for approval before a community-template release; public visibility does not grant an open-source license.
