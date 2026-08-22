# Marching-Orders Compliance Checklist

Tracks where the app (this repo) diverges from the team's "marching orders" — the handoff docs at
`/Users/DJ/Documents/ UCLA EMBA/ Summer 2026 Courses/Tech_ Kramer/Rundle/handoff/` (team KB, v3 strategy
doc, real scoring engine) plus the 8/16/26 team call transcript. **Aesthetic/visual items are explicitly
out of scope** — this is functional/business-logic compliance only. Work through items one at a time,
check them off as they land, add new ones as they're found.

Live data source: `js/data.js` (the only file `index.html` actually loads — `data/story.json` and
`data/personas.json` are dead/unused, see Housekeeping below).

---

## ✅ Done

- [x] **Trust tiers + transferability/readiness split** (2026-08-21) — Reviewed as standalone mockups
  first (published artifact), approved, then wired into the live app across all 5 personas. `js/data.js`:
  added `trust` field to all 19 skill rows (documented / employer-verified / simulation-verified, mapped
  by skill name — no skill row uses "credential-verified," that's shown separately via the persona's own
  CCS/CCA badge); added `transfer` field to all 18 real-role matches using the actual occupation-level
  transferability numbers from Hailey's Product Attributes report (Exhibit 5) — same number for a given
  role across every persona, since transferability is occupation-to-occupation, not worker-specific (HIM
  Coder II excluded, not a real OCC role, consistent with the earlier "no change needed" call); added
  `closesAt` field only to the 3 matches with a genuine skill gap (not credential-only gaps) — RC's and
  DW's CDI match get "L3 · Subtle errors" (query-writing gap), JT's CDI match gets "L1 · Foundations"
  (baseline ICD-10-PCS proficiency gap) — mapped to the KB's 4 curriculum levels. `js/render.js` +
  `css/app.css`: new `.skill-badges`/`.trust` chip next to the existing tier badge, new
  `.transfer-badge` next to the existing (unchanged, still-animated) fit-ring, new `.match-closes` tag.
  Verified live on Priya (trust tiers + transfer badges) and Denise (closes-at tag).

- [x] **Real roles/wages/credentials** (2026-08-21) — Removed the fabricated "Coding Quality Auditor"
  role (11 occurrences across all 5 personas). Corrected wages to match the real BLS table (HIT
  $67,310, CDI Specialist $85,000, Health Services Manager $117,960). Added a `credential` field per
  gated match (RHIT / CCDS-CDIP / Bachelor's degree) and a 🔒 lock-badge UI element in `js/render.js` +
  `css/app.css` (`.match-credential`) to display it — this UI element didn't exist before. Introduced
  the previously-missing lateral, same/lower-pay real roles (Medical Assistants, Medical Secretaries &
  Admin Assistants, Billing & Posting Clerks, Healthcare Business/Operations Analyst) so the "easy
  matches pay the same, the big-upside ones are gated" pitch is now visible in the demo. Verified live
  in-browser on Priya Kapoor's profile.

- [x] **Real role-table coverage + fabricated map-screen titles** (2026-08-21) — Discovered
  `build_data.py`'s `OCC` dict actually defines **11 real target roles, not 8** (the 8-role table in
  memory was incomplete). The two previously-unaccounted-for roles: "Bookkeeping, Accounting & Auditing
  Clerks" ($49,210, no credential) and "Data Entry Keyers" ($38,000, declining -25% growth — the
  "AI ate this job" example). Added **Healthcare Compliance/Privacy Officer** (CHC-gated, $75,000) to
  Marcus's actual matches — it was the one real role unused anywhere. Fixed the **"Mapping your skills"
  screen** (visible live in the demo, confirmed via browser) — every persona's `map.roles` list ended
  with the identical 6 fabricated titles (Reimbursement Specialist, Utilization Review Coordinator,
  Medical Coding Auditor, Practice Operations Coordinator, Insurance Verification Specialist, Patient
  Access Coordinator), none in the real `OCC` table. Replaced that block with the 2 real spare roles
  across all 5 personas. Verified live in-browser on Marcus Okafor's profile (matches list + mapping
  screen).

- [x] **"HIM Coder II" reviewed, no change needed** (2026-08-21) — Confirmed it's not in `build_data.py`'s
  `OCC` dict, but on reflection it doesn't claim to be one either: it's not styled as a scored match
  against an external O*NET occupation, just Marcus's plausible next internal step within his current
  employer's coding ladder (trainee to full coder), inside the same anchor occupation everyone's already
  in. Different situation from "Coding Quality Auditor," which impersonated a real, externally-scored
  target role. Left as-is.

---

## Roles, Wages & Credentials — remaining follow-up

- [ ] **Health Services Manager's "gap" narrative is still wrong for Priya** — `have`/`need`/`provider`
  describes a fictional "Healthcare leadership credential" / "HIM Leadership Certificate" (CEU-funded
  AHIMA course) as the path to HSM. The real gate is a **Bachelor's degree**, which a CEU course can't
  grant. Recommendation (2026-08-21, not yet applied): don't invent a degree pathway — nothing in the
  handoff docs supports Rundle offering one, and the real credential rail is AHIMA/CEU-specific, a
  different thing. Show the gate honestly instead (need: "Bachelor's degree" / "Required for HSM roles —
  not part of Rundle's verification scope") and drop the fictional CEU provider card. **DJ explicitly
  deferred this (2026-08-21) — low visibility risk, unlikely anyone reviewing looks this closely. Skip
  unless it resurfaces.**
- [ ] **Readiness (the fit-ring %) is still hand-typed**, not computed via the real
  `100×Σmin(w,r)·r/Σr²` formula. The transferability half of this is now real (see above) — only the
  worker-specific readiness number is still authored by feel. Running the actual formula per persona is
  a bigger, separate lift.

## Data & Scoring Engine

- [ ] **No real scoring engine runs at all.** All fit%, evidence strings, etc. are static constants in
  `js/data.js`, not computed from `build_data.py`/`worker_profile.py`.
- [ ] **No evidence-generator trust-tier fusion** (credential floor / tenure saturating prior / KPI
  upload weight 0.45 / simulation weight 0.85) — the app shows flat "evidence" text with no tiering.
- [ ] **Evidence isn't time-boxed.** Per the 8/16 team call, real verification evidence is meant to be a
  time-windowed sample (e.g. last 24 months) specifically to prevent cherry-picking best-of examples —
  modeled on third-party company audits. The app's evidence strings ("3,140 charts coded · 96%
  accuracy") don't reflect any time window or anti-cherry-pick framing.

## Personas & Worker Types

- [ ] **All 5 personas are currently employed**, matching neither of the KB's two required worker types
  ("displaced" — has history, lost system access — or "never employed" — no record at all). Underlying
  gap is NOT fixed — still no never-employed persona/entry-point in the prototype (Hailey's separate
  screen spec, shared 2026-08-21, confirms this should be a named homepage entry point, "an entry point
  for users without a record to help build the rungs of the ladder" — a concrete missing screen, not
  just a narrative mismatch). **Partial mitigation applied (2026-08-21):** the picker screen's
  "In-class demo" banner now explicitly discloses the scope gap — "All 5 have prior work history to
  verify. The production version also supports workers with no record at all, verified instead through
  a guided simulation practicum." DJ chose disclosure-in-copy over building the feature, given time
  constraints. Revisit if there's time before the demo.
- [ ] **Priya naming collision** — app's Priya Kapoor (9 yrs, CCS, Chicago) vs. the real KB's example
  worker Priya (3 yrs, RHIT, associate's in HIM) are different people with the same name. Never
  reconciled.

## Business Model / Funding Framing (low priority)

- [ ] Two-pillar language, WIOA public funding, and the audit-vs-curriculum split never appear in the
  app. Per the 8/16 call, Hailey told the team **employers pay, full stop** — no WIOA was mentioned live,
  so this may be lower-priority than originally flagged; the WIOA framing shows up only in the v3 doc
  written the next day. Probably fine for a worker-facing demo either way — revisit only if the team
  wants funding messaging in-app.

## Assessment Modules — intentional deferral, not a bug

- [ ] Module 1 (graded inpatient coding) and Module 2 (AI-assisted audit) stay unbuilt on purpose — DJ's
  live objection ("feels hackable," "IQ test") is unresolved pending the 8/22/26 team call. The current
  Chart Review screen's "no score, no fixed answer key" copy correctly reflects this. **Don't rebuild or
  re-add without checking in first.**

## Housekeeping

- [ ] `data/story.json` and `data/personas.json` are dead files — nothing in `index.html`/`js/*.js`
  references them (`js/data.js` is the only live data source, confirmed via grep). Either delete them or
  clearly mark them as historical/reference-only so a future session doesn't edit the wrong file.
