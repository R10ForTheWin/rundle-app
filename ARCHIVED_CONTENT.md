# Archived content

Screens and sections that were cut from the live app during the 8/22
polish pass, kept here in case any of them are wanted back later. All
of this still exists in git history too (see the commit noted under
each entry), but it's collected here so it doesn't have to be dug out
of a diff.

To restore something: copy the snippet back into the matching file,
wire up any click handler/route it depended on (noted below), and
bump the relevant cache-bust `?v=` number in `index.html`.

---

## 1. Skill Detail screen

**Removed in:** `52b59cb` — "Fix hidden demo-tool bug, cut skill-detail
screen, tighten Employment"

**Why:** It always showed the same hardcoded skill ("ICD-10-PCS
Coding") no matter which skill row you tapped, so "view all skills and
evidence" and tapping any row were both lying about where they'd take
you. The one genuinely useful piece — Credential tie-in — was moved
onto Verified Skills instead of being deleted.

**What it had**, beyond the Credential tie-in card (which is live on
Verified Skills now): a "Rundle evidence" card (accuracy bar, charts
coded, common error types), a "What would move this forward" card with
a "Strengthen with a quick review" CTA, and an "Occupation benchmark"
card (O·NET Attention-to-Detail ranking).

**HTML shell** (was in `index.html`, right before `#screen-review`):
```html
<section class="screen" id="screen-skill-detail" data-screen="skill-detail">
    <div class="app-header"><div class="back-btn" data-back="home" style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;"><svg style="width:1rem;height:1rem;transform:rotate(180deg);color:var(--ink-soft)"><use href="#i-chev"/></svg><div class="name" id="skilldetail-title"></div></div></div>
    <div class="scroll section-pad" style="padding-top:0.2rem;" id="skilldetail-body"></div>
</section>
```

**Render function** (was in `js/render.js`):
```js
function renderSkillDetail(p, story, reviewDone) {
  var titleEl = document.getElementById('skilldetail-title');
  if (titleEl) titleEl.textContent = story.skillDetail.name;
  var el = document.getElementById('skilldetail-body');
  if (!el) return;
  var sd = story.skillDetail;
  var errRows = sd.errors.map(function (e) {
    return '<div style="display:flex;justify-content:space-between;">' + e.t + ' <span class="mono">' + e.n + '</span></div>';
  }).join('');
  var strengthenBlock = reviewDone
    ? '<div class="evidence-preview" style="margin-bottom:0.7rem;">' +
        '<span class="tag"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>AI-assisted review</span>' +
        '<div class="line">' + CHART_REVIEW_SUMMARY + '</div></div>'
    : '';
  var topError = sd.errors.slice().sort(function (a, b) { return b.n - a.n; })[0];
  var forwardBlock = sd.tier === 'expert' ? '' :
    '<div class="card strengthen-card">' +
      '<div class="card-title-row"><span class="card-title">What would move this forward</span></div>' +
      '<p>Two things raise this: more verified reps, and fewer flagged errors on your most common issue &mdash; <strong style="color:var(--ink);">' + topError.t + '</strong> (' + topError.n + ' flagged so far).</p>' +
      (reviewDone ? '' : '<div class="strengthen-cta" id="skilldetail-next-review">Strengthen with a quick review <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>') +
    '</div>';
  el.innerHTML =
    '<div class="card"><div class="card-title-row"><span class="card-title">Rundle evidence</span><span class="tier ' + sd.tier + '">Level: ' + tierLabel[sd.tier] + '</span></div>' +
      '<div class="bar-row"><div class="bar-label"><span>Accuracy</span><span class="mono">' + sd.accuracy + '%</span></div><div class="bar-track"><div class="bar-fill" style="width:' + (100 - sd.accuracy) + '%"></div></div></div>' +
      '<div class="bar-row"><div class="bar-label"><span>' + sd.metricLabel + '</span><span class="mono">' + sd.count + '</span></div></div>' +
      '<div class="divider-label">Common error types</div>' +
      '<div style="font-size:0.72rem;color:var(--ink-soft);line-height:1.9;">' + errRows + '</div></div>' +
    strengthenBlock +
    forwardBlock +
    '<div class="card"><div class="card-title-row"><span class="card-title">Occupation benchmark</span></div>' +
      '<p style="font-size:0.72rem;color:var(--ink-soft);line-height:1.5;margin:0 0 0.5rem;">O&middot;NET: Medical Records Specialists (29-2072.00) ranks <strong style="color:var(--ink);">Attention to Detail</strong> as the single most important work style for this role &mdash; 100 of 100.</p>' +
      '<div class="bar-track"><div class="bar-fill" style="width:0%"></div></div></div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">Credential tie-in</span></div>' +
      '<div style="display:flex;align-items:center;gap:0.5rem;"><svg style="width:1.1rem;height:1.1rem;color:var(--sienna)"><use href="#i-shield"/></svg>' +
      '<div><div style="font-size:0.78rem;font-weight:600;">' + p.cred + ' &middot; AHIMA</div><div class="status-ok"><svg><use href="#i-check"/></svg>' +
      (p.status === 'active' ? 'Active, verified' : 'In progress') + '</div></div></div></div>' +
    '<div class="cta" id="skilldetail-back-home">Back to home <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>';
}
```

**Wiring it depended on** (`js/app.js`): `'skill-detail'` in the
`SCREENS` array and `SCREEN_LABELS`; an `onScreenShow` branch calling
`renderSkillDetail(...)`; click handlers for `#verified-skills-view-all`,
`.skill-row`, `#skilldetail-next-review`, `#skilldetail-back-home`, and
`#review-view-evidence-btn` (all pointed at `showScreen('skill-detail')`).
Restoring this screen also means putting the per-row chevron affordance
back — see the CSS note below.

**Related CSS that was trimmed alongside it** (still restorable, was
removed from `css/app.css` in the same push): the `.skill-row` entry in
the `cursor:pointer` affordance list, and the `.skill-row-arrow` /
`.skill-list-head-arrow` rules (the little chevron on each skill row
and its header-row spacer).

---

## 2. "Enter it manually instead" (Employment screen)

**Removed in:** `52b59cb`

**Why:** Redundant next to the resume upload option directly below it
— two ways to say "type it in yourself" on one screen. Simplified to
just "or → Upload your resume."

**Snippet** (was in `js/render.js`, inside the `employment-alt-section`
card, right before the resume-upload block):
```html
<div class="employment-manual-title">Enter it manually instead</div>
<div class="employment-manual-sub">Shows on your transcript as self-reported, which employers weigh less.</div>
<div class="employment-manual-cta" id="employment-manual-btn">Enter manually</div>
<div class="employment-manual-divider">or</div>
```

**Wiring it depended on** (`js/app.js`):
```js
if (e.target.closest('#employment-manual-btn')) {
  var manualBtn = document.getElementById('employment-manual-btn');
  if (manualBtn) unlockEmploymentContinue();
  return;
}
```
(`unlockEmploymentContinue()` itself is still in the codebase — the
resume-upload path uses it too — so restoring this is just adding the
button back and re-adding this handler.)

The CSS (`.employment-manual-title`, `.employment-manual-sub`,
`.employment-manual-cta`, `.employment-manual-divider`) was never
deleted, so it's still in `css/app.css` and ready to use.

---

## 3. Old standalone "Results Summary" screen

**Removed in:** `c8a175d` — "Real payroll logos, merged results/skills
screen, back-nav fix, copy cleanup"

**Why:** It was its own screen shown right after the audit demo,
before landing back on Verified Skills — an extra stop for the same
information. The hero ("You are verified" + the stats grid) was kept,
just moved to the top of Verified Skills instead of living on its own
screen.

**What's genuinely gone** (not merged anywhere): the "You are X% ready
for [top match title]" teaser row with the wage line, and its own "See
my proven skills" CTA. This is the exact content the user asked to cut
explicitly ("lose the 96% ready for medical secretaries... that info
comes later after the matching").

**Full original function** (was in `js/render.js`):
```js
function renderResultsSummary(p, story) {
  var el = document.getElementById('results-summary-body');
  if (!el) return;
  var topMatch = story.matches[0];
  el.innerHTML =
    '<div class="done-wrap" style="padding-top:0.5rem;">' +
      '<div class="done-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
      '<h2>You are verified</h2>' +
      '<p>Your transcript is live and it is yours. It stays private until you decide who can see it.</p>' +
    '</div>' +
    '<div class="card results-stats">' +
      '<div class="results-stat"><div class="results-stat-label">Credentials</div><div class="results-stat-value">1 verified</div><div class="results-stat-sub">' + p.cred + ', ' + p.status + '</div></div>' +
      '<div class="results-stat"><div class="results-stat-label">Employment</div><div class="results-stat-value">' + p.tenure + '</div><div class="results-stat-sub">Payroll confirmed</div></div>' +
      '<div class="results-stat"><div class="results-stat-label">Records reviewed</div><div class="results-stat-value">' + story.skills.length + ' of ' + story.skills.length + '</div><div class="results-stat-sub">0 gaps disclosed</div></div>' +
      '<div class="results-stat"><div class="results-stat-label">Assessment</div><div class="results-stat-value">' + story.sim.accuracy + '%</div><div class="results-stat-sub">Across 4 charts</div></div>' +
      '<div class="results-cred-row"><span>Credential valid through <strong>' + p.renew + '</strong>. We will remind you when it is time to renew.</span><span class="trust employer">Simulation-verified</span></div>' +
    '</div>' +
    '<div class="results-teaser">' +
      '<div><div class="results-teaser-title">You are ' + topMatch.fit + '% ready for ' + topMatch.title + '</div>' +
      '<div class="results-teaser-sub">That role pays ' + topMatch.wage.split(' median')[0] + ', see the gap that&rsquo;s left.</div></div>' +
      '<div class="results-teaser-pct">' + topMatch.fit + '%</div>' +
    '</div>' +
    '<div class="results-actions">' +
      '<div class="cta" id="results-summary-continue" style="margin-top:0;">See my proven skills <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>' +
    '</div>';
}
```

**HTML shell it needs** (a screen section + `#results-summary-continue`
routing to `verified-skills`), and the `'results-summary'` entry back
in `SCREENS`/`onScreenShow` in `js/app.js`. Note `story.matches[0]` is
whatever the data currently ranks as the top match — if this comes
back, double check that's still the intended "top" definition.

---

## 4. "What's next" card (bottom of Job Matches / Home)

**Removed in:** `c8a175d`

**Why:** User call — redundant prompt at the bottom of the matches
list.

**Snippet** (was appended at the end of `renderHome`'s `el.innerHTML`,
right after the Rudy "more roles will show up" note):
```html
<div class="card strengthen-card" style="margin-top:0.7rem;"><div class="card-title-row"><span class="card-title">What&rsquo;s next</span></div>
  <p>Check Training to close a skill gap and open up more matches.</p>
</div>
```
No dedicated click handler — it was purely informational.

---

## Also worth knowing

- **"View all skills and evidence" link** and the **per-row chevron**
  on Verified Skills were removed alongside the Skill Detail screen
  (item 1) since they had nowhere honest left to point. If skill-level
  detail comes back as a *real* per-skill page (not one hardcoded
  skill), these are the two spots to re-add a tap affordance.
- Everything above is also sitting untouched in git history if a
  straight `git show <commit> -- <file>` is easier than copy-pasting
  from this file.
