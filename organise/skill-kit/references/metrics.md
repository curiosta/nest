# Metrics: define them before the fair

Publish your definitions with your numbers. Report each stage separately, and
keep internships and apprenticeships apart from jobs.

## The 7-stage funnel (NEST recommendation R5)

| # | Stage | Definition | How you count it |
|---|---|---|---|
| 1 | Registered | Unique people who completed registration (de-duplicate by phone) | registration export |
| 2 | Attended | Registered or walk-in people who entered the venue | gate scans or token issue logs |
| 3 | Interviewed | People who had at least one interview | zone token "called" logs or employer sheets |
| 4 | Offer logged | People with an offer logged at the central offer desk, naming role, pay (CTC and in-hand), engagement type, location and joining date | `templates/offer-log.csv` (one row per offer; count unique people too) |
| 5 | Joined | People confirmed to have reported for work and joined | follow-up call/SMS plus employer confirmation |
| 6 | Employed at 30 days | People confirmed still working about 30 days after joining (first salary received, if known) | follow-up call/SMS plus employer confirmation |
| 7 | **Still employed at 90 days** | People confirmed still working about 90 days after joining | follow-up call/SMS plus employer confirmation |

Track **shortlists and second-round invites separately**: they are not offers.

## Offer-to-joining rate (per employer)
`joined (stage 5) ÷ offers logged (stage 4)` for that employer, counted from the
offer log and the follow-up tracker. **NEST suggestion (R6), not an official rule:**
consider not re-inviting employers whose rate is below 30%. Check the reasons first
(for example, candidates turning down distant postings), apply the same rule to all
employers, tell them about it in the invitation, and let them explain.

Also track: employers present vs committed, openings committed vs filled,
in-hand pay bands offered, candidates by zone, women and persons with
disabilities (only if voluntarily disclosed), complaints and incidents, and
joining problems per employer.

## Honest reporting rules
- Never mix "offers", "shortlists" and "placements" into one number.
- Only offers logged at the central offer desk count as offers.
- If you revise a number, publish the old and new number, the date and the reason.
- Say who counted (organiser, employer or government partner) and whether
  anyone checked it independently.
- If a number is unknown, write `TBC`. Don't estimate it.
