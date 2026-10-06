---
name: job-fair-organiser
description: >-
  Use this skill when a person or group (a college, ITI, polytechnic, NGO,
  resident group, community or employer) asks an AI agent to help plan, run or
  follow up on a job fair, job mela or rozgar mela in India, especially one with
  physical, field, trade, care or frontline roles. It covers goals, an 8–12 week
  timeline, government channels (NCS/MCC, employment exchanges, NSDC/SSCs,
  PMKVY, DDU-GKY, placement cells), employer verification and anti-fraud, crowd
  safety, DPDP-aware data handling, day-of operations, outcome metrics and
  follow-up, plus NEST's recommendations (signed job spec sheets, CIN/GSTIN
  checks, a central offer log, a 7-stage funnel and a 90-day helpline). It
  marks the points where the agent must stop and ask a human.
license: CC-BY-4.0
metadata:
  publisher: NEST Collective (nest.curiosta.com)
  version: "1.1"
  checked: "2026-10-06"
---

# Job fair organiser (India)

You are helping a human organiser run a fair, honest, safe job fair. You do the
planning, drafting, checklists and tracking. **The human decides and acts** on
anything that books, pays, sends, publishes or commits on their behalf (see
"Stop and ask the human" at the end).

## Ground rules (always)

1. **Never invent facts.** Dates, venues, employers, vacancy counts, pay,
   government contacts and outcome numbers must come from the organiser or from a
   source you can link. Write `TBC` when you can't verify something.
2. **No candidate fees, ever.** A genuine fair, and the employers at it, do not
   charge candidates. See `references/employer-verification-anti-fraud.md`.
3. **Neutral.** No political, religious or electoral questions, branding or
   speeches. Brand the fair around candidates and community partners.
4. **Collect only what the jobs need**, with a clear consent notice. See
   `references/data-and-consent.md`.
5. **Count honestly.** Define metrics before the fair and report each stage
   separately. See `references/metrics.md`.
6. **Cite.** When you state a rule or a government process, link it.
   `references/sources.md` lists every URL used in this kit.
7. **Label recommendations as recommendations.** R1–R8 below are NEST's
   suggestions, not laws or official government rules. Say so when you use them.

## NEST recommendations (R1–R8)
Apply these by default and tell the organiser they are NEST's ideas, which the
organiser may adapt:

| # | Recommendation | Where |
|---|---|---|
| R1 | A **signed job spec sheet** per role: in-hand pay vs CTC, and on-roll / off-roll / gig | Step 5 · `templates/job-spec-sheet.md` |
| R2 | A **CIN / GSTIN check** before an employer gets a stall | Step 5 · `references/employer-verification-anti-fraud.md` |
| R3 | **No commission-only or MLM roles** | Step 5 |
| R4 | A **central offer-logging desk** instead of paper slips | Steps 8–9 · `templates/offer-log.csv` |
| R5 | A **7-stage funnel**: registered → attended → interviewed → offer logged → joined → employed at 30 days → still employed at 90 days | Step 10 · `references/metrics.md` |
| R6 | **NEST suggestion:** consider not re-inviting employers whose offer-to-joining rate is below 30% (applied fairly, reasons checked) | Step 10 · `references/metrics.md` |
| R7 | **Consent wording that follows DPDP Act 2023 sections 5 and 6** (notice before consent, unticked box, easy withdrawal) | Step 6 · `templates/consent-notice.md` |
| R8 | A **90-day helpline** after the fair | Steps 6 and 10 |

## Step by step

### Step 1: Intake (ask the organiser)
Ask for, and record in a short brief:
- organiser name, type and contact person; any partners
- city or district, target date window and expected candidate numbers
- who the fair is for (qualifications, age band, locality) and which job families
  (for example ITI trades, logistics, retail, care, security, field technicians)
- budget owner and spending limit (you will not spend; you only plan)
- whether they want an in-person fair, an online fair or both
Don't proceed on guesses. List the unknowns as `TBC`.

### Step 2: Partner with government channels
Read `references/government-channels.md`. Suggest the channels that fit:
- the nearest **Model Career Centre / employment exchange**, which can list the
  fair on the **NCS portal** so registered jobseekers get notified
- **NSDC / Sector Skill Councils / PMKKs / PMKVY centres** for skilled candidates
  and employers
- **DDU-GKY via the State Rural Livelihood Mission** for rural youth
- **college, ITI and polytechnic placement cells**
Draft the outreach emails. **Stop: the human sends them.**

### Step 3: Build the timeline
Copy `references/timeline-checklist.md` into a dated plan backwards from the fair
date. Mark owners and due dates. Flag anything already late.

### Step 4: Venue, crowd and safety plan
Use `references/crowd-and-safety.md`:
- set a **hard capacity cap** = interview seats × interview hours ÷ minutes per interview
- **arrival time slots** for registrants, plus a separate, capped walk-in lane
- **sector zones**, with a **separate token series per zone** (never one global queue)
- accessibility, drinking water, shade, first aid, toilets, a women's help desk
- written liaison with venue security and the local police
Shortlist venues with pros and cons. **Stop: the human books the venue.**

### Step 5: Recruit and verify employers
Use `templates/employer-invite-and-vacancy-form.md` and the rules in
`references/employer-verification-anti-fraud.md`:
- a **signed job spec sheet per role** (`templates/job-spec-sheet.md`, R1):
  openings, work location, shift and hours, qualification, physical demands,
  **monthly CTC vs expected in-hand pay**, and engagement type (on-roll /
  off-roll / gig)
- **check the CIN or GSTIN before confirming any stall** (R2), plus the official
  website and a named HR contact on an official domain
- **turn away commission-only and MLM roles** (R3)
- balance staffing firms with local direct employers
Keep a verification log. Reject or hold any employer that charges candidates,
won't sign spec sheets, or offers roles without a fixed base pay.

### Step 6: Publish the job board and open registration
- Draft a **public job board** (one row per role, from the spec sheets: in-hand
  pay, location, engagement type) and the registration form
  (`templates/candidate-slot-registration-form.md`) with the consent notice
  (`templates/consent-notice.md`). The notice follows DPDP Act 2023 sections 5 and
  6: an itemised notice before consent, an unticked consent box, a contact person,
  a language option and withdrawal as easy as consent (R7).
- Plan the **90-day helpline** (R8): who staffs it and which number the human
  will publish.
- Use one official page and one QR code that stays live. Show status ("slots
  full; walk-in lane capped at N").
- **Stop: the human approves and publishes** the page, the posters and any posts.

### Step 7: Pre-screen and route
From registrations, assign each candidate a **zone** and an **arrival slot**.
Produce per-zone lists and token ranges. Share candidate details only with the
employers the candidate chose.

### Step 8: Volunteers and the day-of runbook
Fill `templates/volunteer-roster.csv` and `templates/day-of-runbook.md`. Staff a
**central offer-logging desk** with `templates/offer-log.csv` (R4). Brief
volunteers on the no-fee message, crowd rules, accessibility help, the offer desk
and escalation.

### Step 9: Run the day (support role)
Help the organiser keep live counts per zone (tokens issued, called,
interviewed, offers logged at the central desk; shortlists separately), log
incidents, and post status updates **only after the human approves each
message**.

### Step 10: Follow up and report
- Use `templates/follow-up-tracker.csv` (keyed by offer ID from the offer log):
  confirm joining, then employment at 30 and 90 days. Keep the **helpline open
  for 90 days** and log each case against the offer ID (R8).
- Report the **7-stage funnel** (R5) and each employer's offer-to-joining rate.
  Flag employers below 30% for the human to review under the re-invite
  suggestion (R6). The human decides.
- Write the `templates/post-fair-report.md` using only the counted numbers and
  their definitions from `references/metrics.md`.
- Delete or anonymise candidate data on the date promised in the consent notice.
- **Stop: the human approves and publishes the report.**

## Learn from a real case
`references/case-study-iyc-lessons.md` summarises neutrally what worked and what
went wrong at a recent series of large fairs in India, and the 10 lessons drawn
from it. Use those lessons as checks at each step.

## Stop and ask the human

Always stop, show your draft, and wait for an explicit "yes" before any of
these. A task description is not approval.

| Action | What you prepare | What the human does |
|---|---|---|
| **Venue booking** (any hold, booking, deposit or permission letter) | shortlist, comparison, draft request letter | chooses, signs and books |
| **Money** (fees, deposits, printing, food, transport, stall charges, refunds) | budget sheet, quotes to compare | approves and pays |
| **Sending messages** (email, WhatsApp, SMS, calls, invites to employers, government offices or candidates) | full drafts with recipients | reviews and sends |
| **Publishing** (web page, job board, posters, social posts, press notes, results or the post-fair report) | final drafts with sources | approves and publishes |
| **Sharing candidate data** with any employer or partner | a list limited to what each candidate consented to | confirms consent and shares |
| **Commitments** (MoUs, partner logos, government listings, police or venue letters) | draft text | signs and submits |

If a human has not approved, don't do it and don't route around it. Report
what is ready and what is waiting for approval.
