# Marching-Orders Compliance Checklist

Tracks where the app (this repo) diverges from the team's "marching orders" — the handoff docs at
`/Users/DJ/Documents/ UCLA EMBA/ Summer 2026 Courses/Tech_ Kramer/Rundle/handoff/` (team KB, v3 strategy
doc, real scoring engine) plus the 8/16/26 team call transcript. **Aesthetic/visual items are explicitly
out of scope** — this is functional/business-logic compliance only. Work through items one at a time,
check them off as they land, add new ones as they're found.

Live data source: `js/data.js` (the only file `index.html` actually loads — `data/story.json` and
`data/personas.json` are dead/unused, see Housekeeping below).

**Also authoritative:** `/Users/DJ/Documents/Claude Bots/Rundle App/OneDrive_1_8-21-2026/` — 13 real
screen mockups Hailey shared 2026-08-21 (`01_Homepage` through `13_PracticumLesson`). Reviewed in full
this session; findings folded in below.

---

## ⚠️ Needs a check with Hailey before acting

- [ ] **"Coding Auditor" appears 4 times across her official screens** at an identical wage ($79,500) —
  01_Homepage ("Coding Quality Auditor," 88% match), 10_Dashboard (readiness list + jobs panel),
  11_JobMatch ("Coding Auditor, Inpatient" — Ardent Health, 88% match, +$29,250), 12_Practicum (same
  $79,500 in the wage table). The identical wage every time means this is very likely a **real role in
  her data model**, just not present (or differently named/coded) in the copy of `build_data.py` this
  session worked from. **Don't silently re-add it based on a guess — ask Hailey directly whether it's a
  real target role** before touching the app again. If confirmed real, it needs to go back in with
  correct data, the same way the other 11 roles were added.

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
  accuracy") don't reflect any time window or anti-cherry-pick framing. **Now has a concrete, buildable
  spec:** screen `06_AuditChecklist` shows a fixed audit period (e.g. Jul 2023–Jun 2025), Rundle (not the
  worker) naming the exact quarters needed, an ISO-style completeness attestation checkbox, and missing
  records showing as a disclosed gap rather than a silent hole — this is a real screen to build toward,
  not just a described mechanic.

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
  constraints. Revisit if there's time before the demo. **Now has a full, buildable spec:** screen
  `03_GetStarted` is exactly this entry point — an explicit two-path picker ("I have worked in this
  field" — 6 min setup, 2.5 hr assessment, certified in 3 days — vs. "I am new to this field / No
  experience needed" — 3 min setup, practicum path, "certified at Level 4"), plus "Funding may be
  available through your workforce board" (WIOA) messaging right on this screen.
- [ ] **Priya naming collision** — app's Priya Kapoor (9 yrs, CCS, Chicago) vs. the real KB's example
  worker Priya (3 yrs, RHIT, associate's in HIM) are different people with the same name. Never
  reconciled.
- [ ] **Same collision pattern, new instance:** screen `01_Homepage`'s sample record card is "Maya Reyes"
  — CCS + RHIT, 7 yrs. The KB's own named example worker Maya is 5 yrs. Neither matches any of the app's
  5 personas (each of whom holds exactly one credential, never both CCS and RHIT together). Low priority,
  same fix pattern as Priya if it's ever addressed.

## Business Model / Funding Framing (low priority)

- [ ] Two-pillar language, WIOA public funding, and the audit-vs-curriculum split never appear in the
  app. Per the 8/16 call, Hailey told the team **employers pay, full stop** — no WIOA was mentioned live,
  so this may be lower-priority than originally flagged; the WIOA framing shows up only in the v3 doc
  written the next day. Probably fine for a worker-facing demo either way — revisit only if the team
  wants funding messaging in-app. **Update:** WIOA does appear twice in her actual screen mockups —
  `03_GetStarted` ("Funding may be available through your workforce board") and `12_Practicum` (a full
  "This may be funded... Check my eligibility" card) — so it's more settled in the real design than the
  8/16 call alone suggested. Still only relevant once the never-employed path exists.

## Assessment Modules — intentional deferral, not a bug

- [ ] Module 1 (graded inpatient coding) and Module 2 (AI-assisted audit) stay unbuilt on purpose — DJ's
  live objection ("feels hackable," "IQ test") is unresolved pending the 8/22/26 team call. The current
  Chart Review screen's "no score, no fixed answer key" copy correctly reflects this. **Don't rebuild or
  re-add without checking in first.**
- [ ] **Real design's mitigations, and why they don't fully resolve the objection:** screens
  `07_AssessmentOverview`/`08_AssessmentModule` show untimed practice, unlimited retries, and "your
  published score is a rolling average across sessions, never one bad afternoon." Real mitigations, but
  the worker still chooses *when* to flip a session from practice to scored — a different flavor of the
  same cherry-picking problem the audit path solves by having Rundle (not the worker) pick the sample
  period. Worth raising this specific nuance at the 8/22 call, not just noting the objection as handled.
  Module 2 also tracks a real rubric behind the scenes (over-flagging counts against the worker, visible
  flag/accept counts) even with no live score shown — good detail if/when this gets built.
- [x] **Built a presentation-safe stand-in (2026-08-21):** new screen `module-demo`
  (`js/render.js` `renderModuleDemo()`, entry point on Home's "What's next" card — "▶ See the
  AI-assisted audit in action") — an auto-playing, ~5s animated walkthrough of Module 2, not an
  interactive assessment. Two synthetic charts in plain English (no real ICD-10 judgment required to
  follow): one where the AI's draft is wrong and gets corrected (DRG updates, dollar-impact badge), one
  where the AI is already right and gets confirmed instead of "fixed" (demonstrates the false-positive/
  over-correction dimension from Hailey's report). A persistent "⏩ DEMO — accelerated, not real
  assessment speed" ribbon stays on screen throughout, and a Replay button resets it. **This does not
  resolve the Module 1-2 hackability objection** — there's no real scoring or answer key here, so
  nothing to game; it exists so DJ has something to click through live in front of classmates who can't
  evaluate real coding judgment calls. Don't mistake this for the real module being built.

## New concepts spotted in the real screens, not yet built (low priority, log only)

- [ ] `10_Dashboard`: a "Your trajectory" panel showing a metric's change over time (e.g. "Coding
  accuracy 94.1 to 97.4... measured across 30 scored sessions over six months").
- [ ] `11_JobMatch`: role-filter chips (All roles / Ready now / One gap away / Requires Rundle) and a
  "Close one gap, unlock 61 roles" impact panel.
- [ ] `12_Practicum`: a human mentor-feedback panel (named mentor, dated review comment) — the KB's
  "human review at each gate" made concrete.
- [ ] Naming difference, not urgent: her Dashboard labels evidence with numeric "Tier 1/2/3" per O*NET
  element rather than descriptive names like the app's new "Documented"/"Employer-verified" chips —
  consider aligning if consistency with her screens matters more than the app's current, more readable
  labels.

## Housekeeping

- [ ] `data/story.json` and `data/personas.json` are dead files — nothing in `index.html`/`js/*.js`
  references them (`js/data.js` is the only live data source, confirmed via grep). Either delete them or
  clearly mark them as historical/reference-only so a future session doesn't edit the wrong file.
