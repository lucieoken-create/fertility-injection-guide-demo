# Fertility injection guide — portfolio demo

A fictional, illustrated interface for following a changing plan one card at a time. This project demonstrates interaction design; it contains no treatment plan, administration instructions or real records. It is not for treatment decisions and has not been medically validated.

## The design problem

Dense instructions can be hard to navigate when a task has several parts and the plan changes. This demo explores a calmer reading experience: a visible phase structure, recognizable equipment illustrations, short cards and explicit boundaries between medication guides.

## Design and features

- Flat vector illustrations inspired by the clarity of airline safety cards, with readable external labels.
- A featured example beside an earlier example, preserving context without claiming a history of doses taken.
- Optional supply selections and reading checks that never gate navigation.
- Medication transitions with large illustrations and an explicit Start button.
- Phone and desktop layouts, keyboard navigation, focus management and accessible current-state text.
- Brief encouragement and confetti that respect reduced motion. No celebration on Back or reload, and no duplicate burst when starting the next guide.
- Self-contained output: no accounts, analytics, third-party scripts, embedded videos or remote requests.

All dose, schedule, effective-date and instruction fields are deliberate placeholders. Medication names identify example interface sections; they do not form a prescribing recommendation. Equipment illustrations are generic identifiers, not device specifications.

## How Codex supported the build

Codex supported iterative layout development, code-native SVG refinement, state and navigation design, accessibility fixes, responsive browser checks and privacy scans. Human review shaped the visual direction and interaction decisions. The result demonstrates a collaborative design/build workflow, not clinical review.

## Run locally

Requires Python 3.9 or newer. No package installation or build dependencies are needed.

```sh
python3 build.py
python3 tests/privacy.py
python3 serve.py
```

Open **http://127.0.0.1:8766/**. The preview binds only to loopback and serves only the generated HTML. No remote repository or deployment is configured.

For browser QA, run an isolated Chrome instance with remote debugging on port 9225, then run the dependency-free browser test with Node 22 or newer:

```sh
node tests/browser.mjs
```

Optional arguments: `--cdp http://127.0.0.1:9225`, `--url http://127.0.0.1:8766/`, and `--output /tmp/portfolio-demo-review`. Test screenshots are written outside this repository.

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

The in-memory state namespace is `fertility-portfolio-demo-v1`. The demo never reads or writes browser storage, and every reload starts clean. Different examples also get separate state keys. No medication administration history is collected.

## Future community template

A forkable community template is planned, but this is a portfolio demonstration rather than a clinical configuration tool. Before community release, content contracts, validation, review responsibilities and safe configuration boundaries need further design. It is not ready for unsupervised clinical reuse.

Generic improvements should move through a deliberate review process:

1. Review the proposed interface or illustration improvement separately from any private content.
2. Manually port only sanitized, relevant changes into this clean project. Never merge private Git history, copy source records, or mirror repositories automatically.
3. Keep fictional configuration separate from reusable code. Rebuild, scan every file and history, and run functional and visual checks.
4. Review the exact public payload and explicitly approve publication.

A shared core can be explored later. There is no automatic synchronization in this demo.

## License and release status

Local review only. No open-source license has been selected or added. A license choice will be proposed for approval before a community release; this draft does not grant an open-source license.
