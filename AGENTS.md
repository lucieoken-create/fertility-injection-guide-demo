# Working on this demo

Read [DESIGN-GUIDE.md](DESIGN-GUIDE.md) before changing presentation, copy or illustrations. Read [CONTENT-SOURCES.md](CONTENT-SOURCES.md) before changing medication-specific content. [README.md](README.md) explains local setup and the deliberate update workflow.

- Work within this separate demo. Preserve the personal original and its history; never merge or automatically sync private content into this repository.
- Keep doses, schedules, dates and prescribed quantities as placeholders. Do not infer medical technique from artwork or invent a regimen.
- Edit source files, then rebuild `index.html` with `python3 build.py`. Keep content in `example-plan.json`, presentation in `styles.css` and `app.js`, and reviewed vectors in `assets/illustrations.json`.
- Preserve optional checks, clear phase/medication boundaries, keyboard support, reduced motion and memory-only state. Navigation never records a dose.
- Run `python3 tests/privacy.py` and the relevant browser checks described in README. Inspect phone and desktop renderings. If adding a file, review it before updating the explicit privacy-test allowlist.
- No publication, remote upload, permission change or license addition without explicit approval. Keep source records, private photos, credentials and screenshots outside the demo repository.
