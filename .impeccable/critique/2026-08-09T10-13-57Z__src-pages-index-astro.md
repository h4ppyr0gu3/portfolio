---
target: homepage (src/pages/index.astro)
total_score: 16
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-09T10-13-57Z
slug: src-pages-index-astro
---
Method: dual-agent (A: 5df1af8b-0314-4abf-a840-d60011195aeb · B: 5fa98743-0919-4d5b-a76a-48e7e75c75a6)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Home active state works; theme toggle lacks aria-pressed / explicit mode announcement |
| 2 | Match System / Real World | 2 | About/meta sell a FOSS blog; page is a CV. Subtitle undersells Head of Technology / EM roles; TIL unexplained |
| 3 | User Control and Freedom | 3 | Nav + theme reversible; no trapped states |
| 4 | Consistency and Standards | 1 | Layout props bug pollutes document title; 7× h1; tablist on normal links; LinkedIn sr-only says Instagram; orphan li |
| 5 | Error Prevention | 2 | Broken title/meta; dual Present jobs; theme button focus:outline-none |
| 6 | Recognition Rather Than Recall | 2 | 17 flat skills; jargon without context; five equal-weight contact channels |
| 7 | Flexibility and Efficiency | n/a | Experience brochure; no expert-task surface |
| 8 | Aesthetic and Minimalist Design | 1 | Dense skill/education dumps; no artifact hero; section titles compete with identity |
| 9 | Error Recovery | 2 | Mostly static; mislabeled footer link; no in-page recovery patterns |
| 10 | Help and Documentation | n/a | Experience portfolio; help docs not expected |
| **Total** | | **16/32** | **Acceptable (50%)** |

#### Design Specificity Verdict

**LLM assessment**: Category-interchangeable Tailwind CV landing. Default neutrals, miswired Graphik/Merriweather fonts falling back to generic sans, composition of photo + name + sectioned résumé. Personal content exists (roles, Zimbabwe/Poland, portrait) but the interface does not author a distinct h4ppyr0gu3 visual world. Experience mode wants work-led first viewport; this ships résumé text instead.

**Deterministic scan**: CLI detector on index + homepage layouts/components returned **0 findings** (exit 0). Static markup scan did not surface the semantic/a11y issues the design review found (heading chaos, wrong sr-only, Layout title bug)—those live in React/JSX runtime or prop wiring the regex HTML detector missed. Detector entrypoint under `.claude/...` was missing; ran `.cursor/skills/impeccable/scripts/detect.mjs`.

**Visual overlays**: No reliable user-visible overlay. Browser MCP tabs failed to persist after create (navigate → "Browser view not found"), so mutation preflight, live-server, and detect.js injection were skipped. URL detect fallback also failed (puppeteer not installed).

#### Overall Impression

A readable public résumé attached to a blog chrome—not an Experience-mode portfolio. The portrait is the only strong authored signal; everything else is template density. Biggest opportunity: let one real artifact (or a sharp hire positioning + CTA) own the first viewport and demote the CV wall.

#### What's Working

1. **Real portrait** — `/portfolio.jpeg` is specific, warm, place-coded; strongest human signal on the page.
2. **Scannable experience scaffolding** — Title / company / dates / location / description pattern works once you accept CV mode.
3. **Honest site chrome** — Three labeled nav items with active Home state; dark-mode preference persistence exists.

#### Priority Issues

**[P0] First viewport is not Experience (no work, no hire intent)**
- **What**: Hero is cropped portrait + name + generic subtitle, then blog-flavored About. No featured project, proof, or single CTA. `cv.json` projects unused.
- **Why it matters**: Visitors deciding whether to contact get a template CV, not artifact-led proof.
- **Fix**: Lead with 1–2 real work pieces or a sharp HoT/automation positioning line; one primary CTA; demote full résumé below.
- **Suggested command**: /impeccable shape

**[P1] Hierarchy collapsed into a CV wall**
- **What**: Identical section h1s; Skills Summary = 17 items; per-role skill repeats; five equal contact lines; O-Level grades dump.
- **Why it matters**: High cognitive load (6 checklist failures); recruiters bounce; conversion dies.
- **Fix**: One page h1; h2 sections; feature ≤4 skills; one primary contact + secondary row; summarize education.
- **Suggested command**: /impeccable distill

**[P1] Semantics / a11y trust breakers**
- **What**: Seven h1s; avatar alt="Extra large avatar"; LinkedIn announced as Instagram; orphan li; document title is the long description (Layout comma-props bug); theme focus:outline-none.
- **Why it matters**: Screen-reader outline broken; SEO/share cards misrepresent; trust erodes.
- **Fix**: Repair Layout/Default props; heading ladder; descriptive alt; correct sr-only; ul wrappers; restore focus; aria-pressed on theme.
- **Suggested command**: /impeccable audit

**[P2] Copy/identity mismatch**
- **What**: Meta/About sell FOSS blogging; page is employment history; subtitle undersells current roles; dual Present jobs.
- **Why it matters**: Visitors cannot form a coherent "who you are for" model.
- **Fix**: Align About to hiring narrative; clarify concurrent roles; refresh meta.
- **Suggested command**: /impeccable clarify

**[P3] Template chrome & end note**
- **What**: Flat gray field, unused fonts, footer year 2024, "Powered by Tailwind CSS and Astro" sign-off.
- **Why it matters**: Softens brand; signals unfinished craft.
- **Fix**: Deliberate type/palette; clean footer.
- **Suggested command**: /impeccable typeset

#### Persona Red Flags

**Jordan (hiring visitor)**: Blog-tone About instead of hire story; TIL unexplained; Portfolio project never shown; 17 undifferentiated skills; five equal contacts with phone first.

**Casey (mobile)**: Brand handle hidden below sm; ~313KB portrait squeezed to w-36; primary contact buried after Education; small top-corner theme target.

**Sam (a11y)**: Heading chaos; useless avatar alt; LinkedIn→Instagram sr-only; bare li entries; focus outline removed on theme; likely weak gray-400 contrast on dark neutrals.

#### Minor Observations

- Hardcoded About diverges from cv.json aboutMe
- ExperienceItem console.log in production path
- Nav role=tablist without tab panels
- Footer absolute h-40 + pb-40 fragility
- Phone formatting without spacing
- Education descriptions repeat subjects
- Cognitive load: high (6/8 checklist failures)

#### Questions to Consider

1. If the Charles Bridge photo were the only branding and nav disappeared, would a stranger know you're a Head of Technology / Rails leader—or just "guy on a boat with a CV"?
2. What single artifact should own the first viewport so the résumé becomes supporting evidence?
3. Should Get in Touch be one door (email or LinkedIn) with the rest demoted?
4. Is this homepage a portfolio or a public résumé attached to a blog—and which should subordinate the other?
