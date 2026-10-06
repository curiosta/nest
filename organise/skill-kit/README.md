# Job Fair Organiser: an open agent skill kit (India)

An open kit that helps **any AI agent** (and any human) plan, run and follow up on
a fair, safe, honest job fair in India, especially for physical, field, trade,
care and frontline roles. Published by **NEST Collective** at
<https://nest.curiosta.com/organise/>.

## What's inside
```
job-fair-organiser/
├── SKILL.md                      # the skill: step-by-step plus stop-and-ask-the-human points
├── README.md                     # this file
├── LICENSE.md                    # CC BY 4.0
├── references/
│   ├── timeline-checklist.md     # 12–10 weeks out → day-of → 90-day follow-up
│   ├── employer-verification-anti-fraud.md
│   ├── government-channels.md    # NCS/MCC, employment exchanges, NSDC/SSCs, PMKVY, DDU-GKY, placement cells
│   ├── crowd-and-safety.md       # caps, slots, sector zones, separate tokens, accessibility
│   ├── data-and-consent.md       # DPDP Act 2023 / Rules 2025-aware data handling
│   ├── metrics.md                # registered → offered → joined at 30/90 days
│   ├── case-study-iyc-lessons.md # neutral case study and 10 lessons
│   └── sources.md                # every URL used
└── templates/
    ├── employer-invite-and-vacancy-form.md
    ├── candidate-slot-registration-form.md
    ├── consent-notice.md
    ├── day-of-runbook.md
    ├── volunteer-roster.csv
    ├── follow-up-tracker.csv
    └── post-fair-report.md
```

## How to use it with an agent
**Agents that support Agent Skills** (a folder with a `SKILL.md` that has YAML
front-matter): unzip and copy the `job-fair-organiser/` folder into the agent's
skills directory (for example a project's or user's `skills/` folder, as your
agent's documentation describes). The agent will load it when you ask for help
organising a job fair.

**Any other chat agent or LLM:** upload or paste `SKILL.md` first, then the
reference or template files you need, and say:
> "Follow SKILL.md. Help me organise a job fair in {{city}} for {{audience}} around
> {{date window}}. Ask me the intake questions first."

**Without an agent:** read `SKILL.md` top to bottom, then work through
`references/timeline-checklist.md` and fill in the templates.

## Rules the kit enforces
- No invented facts: unknowns are `TBC`; government processes are linked.
- No candidate fees; vacancy and pay commitments in writing.
- Neutral: no political, religious or electoral questions or branding.
- Collect only what the jobs need, with a clear consent notice.
- Honest metrics, defined before the fair.
- The agent **stops and asks the human** before booking venues, spending money,
  sending messages, publishing, sharing candidate data or signing commitments.

## Sources and freshness
Checked 6 Oct 2026 (IST). Government links move, so re-check anything you rely on.
IYC figures in the case study are labelled as IYC's own claims. Not legal advice.

## Licence
© 2026 NEST Collective (nest.curiosta.com). Licensed under **Creative Commons
Attribution 4.0 International (CC BY 4.0)**: <https://creativecommons.org/licenses/by/4.0/>.
You may share and adapt the kit for any purpose, including commercially, if you
give appropriate credit, for example:
> "Based on the Job Fair Organiser skill kit by NEST Collective (nest.curiosta.com), CC BY 4.0."

Linked third-party sources (government documents and news articles) remain under
their own terms; the licence covers this kit's own text and templates.

## Feedback
Suggestions and corrections are welcome through the NEST Collective WhatsApp
community admins (ask Manoj or Manasi). No public invite link is published.
