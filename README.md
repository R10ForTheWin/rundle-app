# Rundle

**Verification and retraining for early-career medical records workers whose entry-level jobs automation removed.**

An audit proves what a worker can already do. A simulation curriculum builds what they can't yet. Neither half works alone: an audit with no path attached is a rejection letter, and a curriculum with no audit attached is a certificate no employer believes.

> ### ⚠️ Demo mode: live APIs are turned off
>
> This is a design prototype, not a running service. Credential lookups, payroll verification, wage data and LLM scoring are **disabled**, and every screen runs on fixed sample data instead.
>
> Buttons that would normally call an API return a canned result or do nothing. That is intentional. **Nothing here is broken.**
>
> Walk through it as a click-through of the product, not a working application.

---

## The problem

A hospital coder with five years of experience is measured constantly. Coding accuracy, chart throughput, audit scores, turnaround time. When her department gets cut, her system access ends the day her badge does, and every bit of that measurement stays behind. Her resume says "Medical Records Specialist, 5 years," which looks identical to the resume of someone half as good.

A second worker passed the CPC exam but has no work history, so AAPC marks him CPC-A, the apprentice designation that takes two years of coding experience to remove. He needs the job to lose the marker, and the marker is why nobody hires him. The entry-level roles that used to solve this are the roles automation eliminated first, because routine work is what they were made of.

AI created two problems in this labor market at once. Capability got harder to prove, and harder to get.

---

## What Rundle does

### Pillar 1: the verification audit

Follows the third-party assurance model that ISO registrars and SOC 2 auditors use. A neutral party checks evidence against a published standard over a fixed period, then issues a certification with an expiry date. Four classes of evidence:

| Class | Contents | Independent of the worker? |
|---|---|---|
| **A. Credential** | CCS, RHIT, CPC, CCA, CPMA. Status, earned date, CEU currency | Yes, the issuer confirms |
| **B. Employment** | Employer, title, dates, status | Yes, worker-permissioned payroll API |
| **C. Documentary** | QA and audit reports, productivity reports, performance reviews across a fixed 24-month window | No, attested and sampled |
| **D. Direct assessment** | Five scored modules on synthetic charts | Yes, observed directly |

Class C is where normal credentialing breaks down, because a worker asked for evidence sends their best quarter. Four audit controls remove that bias: a fixed 24-month lookback with a written completeness attestation, Rundle picking the sample rather than the worker, contiguous periods so one strong quarter can't stand alone, and gaps disclosed on the transcript as findings rather than quietly dropped.

Those controls handle selection bias but not fabrication. That is why Class D exists. It is the audit's independent test, the same way an auditor counts inventory rather than trusting the client's ledger.

**The five assessment modules** run about 2.5 hours and can be spread across sessions: inpatient coding, AI-assisted audit, physician query drafting, compliance judgment, and a working-style inventory reported separately and never used as a pass/fail gate.

Module 2 is the differentiator. The worker reviews charts an AI has already coded, into which errors were deliberately injected: unspecified codes, missed CC/MCC capture, wrong sequencing, unsupported codes. Correct what's wrong, leave what's right. Scored on error catch rate, false positive rate, DRG correction accuracy, override judgment and minutes per chart.

### Pillar 2: the simulation curriculum

No existing program teaches the job as it exists today. AAPC, AHIMA and college health information programs teach people to code a chart from scratch, which was the job before automation. The entry-level task now is supervising the system that codes the chart: checking its output, spotting unsupported codes, deciding when to override and when to defer, escalating what it can't handle. Workers used to pick that up on the job from a senior coder, and the on-the-job step is exactly what disappeared.

Four levels, each with a human-reviewed gate:

- **L1 Foundations.** Code synthetic charts unaided. You cannot audit a machine before you know what a correct result looks like.
- **L2 Assisted review.** AI drafts codes with clear, findable errors. Builds the discipline of not rubber-stamping machine output.
- **L3 Subtle errors.** Missed CC/MCC capture, sequencing errors, codes the documentation doesn't quite support. Adds query drafting and escalation judgment.
- **L4 Production.** Volume, time pressure, mixed complexity. Capstone is auditing a realistic batch at production standard.

Human review at each gate is what separates a supervised practicum from a video course, and it's what makes the content eligible for continuing education credit.

---

## The scoring engine

Every signal translates into one coordinate space: roughly 29 O\*NET elements covering skills, knowledge and abilities, each scored 0 to 100. Without a shared vocabulary there's no way to compare what a worker has against what a target role requires.

Four generators fill that vector. A verified credential sets floors on specific elements, taken from the issuer's published exam blueprint, because a credential proves minimum mastery and can therefore only raise a score. Verified tenure adds a weak prior that saturates over time. An uploaded KPI runs through a calibration curve, then distributes across the elements the metric actually evidences. Simulation observations map the same way, and they're the only generator that needs nothing from a third party.

When two generators disagree about the same element, they're fused by trust-tier confidence with provenance preserved, so an employer can click any score and see the evidence behind it. Every signal carries a visible tier: claimed, documented, demonstrated, third-party verified, outcome-confirmed.

Readiness against a target role is importance-weighted coverage of that role's requirements. Whatever falls short gets ranked by importance multiplied by shortfall. That ranked gap list is simultaneously the worker's development plan and the specification for which curriculum content to build next.

---

## What's in this repo

The interactive prototype. Screens covering:

- Homepage, contrasting proxy screening against evidence
- Two verification paths, one for workers with history and one for workers with none
- Credential entry, payroll connection, audit checklist, assessment overview
- The AI-assisted audit module: synthetic chart on the left, AI-drafted codes with planted errors on the right, live DRG updates as the worker corrects
- Simulation practicum, L1 through L4, with mentor-reviewed gates
- Verification complete, showing verified items, disclosed gaps, certification date, closest role, readiness and wage delta
- Signed-in homepage and job matches, ranked by verified evidence rather than keywords

---

## Data and technology

These are the intended integrations. **All of them are disabled in this prototype**, which runs on fixed sample data.

- **O\*NET Web Services** for the occupational map
- **Bureau of Labor Statistics Public Data API** and **CareerOneStop APIs** for wage and outlook data
- **Worker-permissioned payroll aggregation** for employment verification. The worker logs into their own payroll account; the former employer is never asked.
- **Synthea** (MITRE) for synthetic patient records in FHIR and C-CDA
- **CMS ICD-10-CM/PCS code sets** as published ground truth
- **An LLM** to inject realistic errors into AI-drafted codes and to score free-text physician queries against a rubric

**Every chart is synthetic.** No protected health information enters the system, so Rundle does not become a HIPAA business associate. The same technology shift displacing these workers is what makes proving their capability nearly free.

---

## Design decisions worth naming

**The certification expires; the facts don't.** Verified credentials and employment history stay on the record permanently because they're historical facts. Only the performance certification expires, on a 24-month cycle that matches the CEU cycle these workers already follow. Expiry devalues stale advantage, which is how a worker returning after a multi-year gap can show what they can do now instead of arguing about what they did years ago.

**Coverage is reported separately from level.** A thinner evidence base shows up as disclosure rather than a silent penalty.

**The worker owns the asset.** Outplacement providers deliver a coaching engagement that ends. Assessment vendors deliver a score the employer keeps and then discards, so every employer re-tests every candidate and throws the result away. Here the verification is something the worker carries, and one verification covers every application after it.

**Working style is advisory only.** Module 5 uses a Five-Factor instrument rather than the MBTI, whose own publisher advises against using it for hiring. It's reported in its own section and never folded into the capability score, which also limits exposure under the Uniform Guidelines on Employee Selection Procedures and the ADA.

**"Practicum," not "apprenticeship."** Apprenticeship is a regulated term under the Registered Apprenticeship framework, with requirements for instruction hours, on-the-job hours, mentor ratios and progressive wages.

---

## What Rundle cannot do

**Create demand.** If entry-level positions disappear entirely, verification does not conjure them. The operating metric is placement rate, specifically placement rate among users with no prior experience, rather than engagement or sessions completed. Optimizing for sessions builds a treadmill. Optimizing for placements builds a ladder.

**Prove itself yet.** Everything rests on whether simulation scores predict actual job performance. Until a tracked cohort demonstrates that, the transcript is an unproven signal. A 25 to 50 person pilot, deliberately including people with no work history, exists to settle it.

---

## Status

Concept and design prototype running in demo mode. Live APIs are disabled and all data on screen is sample data. Not a live service.
