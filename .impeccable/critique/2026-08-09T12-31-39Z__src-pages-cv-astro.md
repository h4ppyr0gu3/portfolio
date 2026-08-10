---
target: CV Generator / src/pages/cv.astro
total_score: 23
p0_count: 1
p1_count: 2
timestamp: 2026-08-09T12-31-39Z
slug: src-pages-cv-astro
---
# Critique: CV Generator (`src/pages/cv.astro`)

Method: dual-agent (A: ad2d7414-b072-48e3-bcc1-44df5fd8f286 · B: fb428269-0683-4bbf-9841-d1369fe79502)
Parent recovered browser inject after B's tab failure; CLI detect remained authoritative (0 findings).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Flash confirms actions; no persistent “Saved · just now” for autosave |
| 2 | Match System / Real World | 3 | Edit/Preview + A4 clear; JSON/share-hash feel power-user |
| 3 | User Control and Freedom | 2 | Confirms on Reset/Delete/Import, but no undo after confirm |
| 4 | Consistency and Standards | 2 | Two equal `cv-btn--accent` peers; Contact vs “Get in Touch” naming |
| 5 | Error Prevention | 3 | Destructive confirms + autosave; section Type change unwarned |
| 6 | Recognition Rather Than Recall | 2 | Collapsed entries need Edit or easy-to-miss double-click |
| 7 | Flexibility and Efficiency | 2 | ↑/↓ only; no shortcuts or bulk include |
| 8 | Aesthetic and Minimalist Design | 2 | Seven equal-weight toolbar actions before the task |
| 9 | Error Recovery | 2 | Import/PDF failures flash once; weak restore path |
| 10 | Help and Documentation | 2 | Lede/banners help; share vs JSON vs PDF fidelity under-explained |
| **Total** | | **23/40** | **Acceptable — significant UX distill needed** |

## Anti-Patterns Verdict

**LLM assessment:** Not AI-aesthetic slop (no purple gradients, glow, pill clusters). Product-slop risk: flat 7-button toolbar, nested item cards, overlapping coaching (lede + example banner + “Identity — edit me”). Earnest portfolio Operate tool with tender accents on chrome and plain A4 document.

**Deterministic scan:** `detect.mjs --json` on CV page + key components → `[]`, exit 0. No rule hits.

**Visual overlays:** Parent injected `detect.js` on a live `/cv` tab (title set to `[Human]…`). Script loaded (200); no overlay nodes / findings object — consistent with clean CLI. Assessment B could not keep tabs alive; parent recovery succeeded for inject only.

**Parent note (skill absolute bans, CSS):** `.cv-a4-page .cv-experience-skills` uses a 2px left border accent — matches the banned “side-stripe” pattern. Detector missed it (CSS-only / not in scanned markup patterns). Prefer indent, weight, or a full subtle rule instead of a left stripe.

## Overall Impression

Competent local-first CV builder with a strong A4 preview as the product truth. The biggest opportunity is hierarchy: stop making the first decision “which of seven toolbar buttons?” and make ownership + Export PDF the obvious path.

## What's Working

1. **A4 Preview as product truth** — real page cards, `1 / N` labels, break-rule guide note.
2. **Honest local-first framing** — example/saved banners state browser-only autosave and share/export without account theater.
3. **Item progressive disclosure** — collapsed summaries + Include checkbox scale for long CVs once discovered.

## Priority Issues

### [P0] Toolbar is a 7-option wall with two equal primaries
- **What:** Load example, Start blank, Import JSON, Export JSON, Copy share link, Export PDF, Reset — with Copy share link and Export PDF both `cv-btn--accent`.
- **Why it matters:** First decision is tool chrome, not “edit my name / export my CV.”
- **Fix:** One primary (Export PDF), one secondary (Share), overflow/menu for JSON + lifecycle (Load/Blank/Import/Reset).
- **Suggested command:** `/impeccable distill` (then `/impeccable layout`)

### [P1] First-run ownership friction
- **What:** Example content fills Preview while Edit still coaches “Identity — edit me”; easy to export David’s CV by mistake.
- **Why it matters:** High-stakes identity confusion at arrival.
- **Fix:** Stronger replace-me placeholders, or gate Share/PDF until name is changed from example.
- **Suggested command:** `/impeccable onboard`

### [P1] Narrow layout buries Preview
- **What:** Grid stacks Edit above Preview until ~1024px; mobile users edit blind for many screens.
- **Why it matters:** The confidence object (A4) disappears when most needed.
- **Fix:** Tabbed Edit|Preview, sticky mini-preview, or jump-to-preview control.
- **Suggested command:** `/impeccable adapt`

### [P2] Discoverability of editing entries
- **What:** Closed cards need Edit or undocumented double-click; ↑/↓ are symbols only.
- **Why it matters:** Recognition fails; keyboard/screen-reader users hit unlabeled controls.
- **Fix:** Single-click open, visible Edit, aria-labels on reorder/delete.
- **Suggested command:** `/impeccable harden` (with `/impeccable clarify` for labels)

### [P2] No undo after confirmed deletes/reset
- **What:** Confirm dialogs then permanent loss; no soft undo.
- **Why it matters:** CV data is high-stakes; one mis-click after OK is catastrophic.
- **Fix:** Soft undo toast (10s) or snapshot before Reset/Import.
- **Suggested command:** `/impeccable harden`

## Persona Red Flags

**Alex (Power User):** No shortcuts for export/reorder; ↑/↓ click-churn; dual accents slow “just PDF it”; no bulk include.

**Jordan (First-Timer):** Complete example CV + dense toolbar before clear “replace this name”; JSON/share too early; double-click easy to miss; Preview buried on phone.

**Sam (Accessibility):** `outline: none` on inputs with weak bottom-border focus; bare ↑/↓ and × without names; photo `alt=""` in editor; status flashes away; `window.confirm` hard for some AT.

## Minor Observations

- Load example vs Reset conceptual overlap
- Editor “Contact” vs Preview “Get in Touch”
- Skills-as-tags vs experience comma skills inconsistency
- A4 always light paper in dark site (correct for print; can look “broken”)
- Experience skills left stripe (absolute ban) should be restyled
- Start blank confirm copy about share links is cryptic

## Questions to Consider

1. If first-screen actions were only **Edit name** and **Export PDF**, what would you hide?
2. Should the example be placeholders to fork, or a showcase of your CV?
3. Document editor (Preview owns viewport) or form-with-preview — which wins on mobile?
4. Can tender accents stay while tool chrome gets quieter / more native-app?
