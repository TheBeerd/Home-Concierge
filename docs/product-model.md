# Product model — DFW HVAC concierge pilot

Working notes on the wedge, MVP shape, and 90-day validation plan this app is built against. Kept here so the app's structure (e.g. the API contract in `mobile/src/api/client.ts`, the `DecisionMemo`/`Contractor` types) stays traceable to *why* it's shaped this way.

## The bet

- **Wedge:** HVAC in DFW — urgent, expensive, trust-heavy, locally dense.
- **MVP shape:** Concierge model. Human-reviewed AI intake → structured bids from contractors → a decision memo comparing them, not a raw quote dump.
- **Monetization:** Success-based (pay on booked job), not pay-per-lead.
- **Moat:** The transaction-level trust graph — price transparency, callback rate, warranty follow-through, quote accuracy — not the chatbot.
- **Validation window:** 90 days, ~100 projects, 20–30 contractors.

## "Booked job" verification (anti-fraud)

Self-reporting alone doesn't work; verification is layered:

1. **Homeowner confirms, not the contractor.** After a bid is accepted, a push notification asks "Did [Contractor] complete this job?" (yes/no + optional photo). The homeowner has already paid the contractor directly, so they have no incentive to lie — this is the primary source of truth. This is the `confirmJobCompletion` flow on the Job Status screen.
2. **Payment-linked confirmation (later stage).** Routing payment or even just the invoice through the app (e.g. Stripe Connect pass-through) turns this into a hard transaction record instead of a self-report.
3. **Diagnostic-fee tripwire.** Contractors log that the paid diagnostic occurred (timestamp, fee charged) — signal that a real visit happened even before a job closes.
4. **Random audit calls** at pilot volume — call a sample of homeowners weekly ("did the job happen, was the price what was quoted"). Also the exact data the trust graph needs.
5. **Contractor consequence for lying:** removal from the platform. Real deterrent once leads are good — a chicken-and-egg problem in the earliest days.

## Structured bid quality — "don't fill it out, don't participate"

- The form must be **faster than status quo** or the gate just repels contractors. Pre-fill job type, urgency, address, symptoms; contractors only fill 6–8 bid-specific fields (diagnostic fee, price range, warranty, license #, exclusions, availability).
- **Tiered gate, not binary, at first.** In the concierge phase a human reviews every bid before it reaches the homeowner — so a soft gate ("add X and Y before this goes out") trains contractors without losing them on submission #1. Automated required-fields validation comes once there's volume.
- **License/insurance verification is upfront, once, at onboarding** — not per-bid. This is the actual backbone of the "verified" claim.

## Decision memo — the bar for "trustworthy enough to act on"

The memo does **not** need to diagnose with certainty. It needs to:

- (a) flag contradictions between contractors,
- (b) flag price/scope outliers,
- (c) never recommend a specific repair itself — only synthesize what licensed contractors said and highlight disagreement.

That reframes the AI's job from "diagnose HVAC systems" (hard, risky) to "compare and flag inconsistency across licensed professionals' diagnoses" (defensible, achievable at launch). See `docs/wireframe.html` (screen 3) and `mobile/src/screens/DecisionMemoScreen.tsx` for the shape this takes.

## Liability — legal disclosure as onboarding gate

- **Mandatory click-through disclosure before first use**, not a buried ToS link: the app does not diagnose, repair, or guarantee contractor work; diagnoses and pricing come from independent licensed contractors; the app is not a party to any repair agreement. *(Not yet built — see "Not yet built" below.)*
- **"Vetted" is a liability landmine.** User-facing copy says **"verified"** (documents checked: active license, active insurance, business registration), never "vetted" (implies a quality endorsement).
- **E&O / tech-platform liability insurance** budgeted from the pilot, even at small scale.
- **Texas contractor-liability and marketplace-facilitator law** review by a lawyer before pilot launch.

## Concierge-first, household-centered positioning

Sold to contractors as an intake/qualification service, not a new workflow to adopt: "We send you appointment-ready homeowners; you don't do any extra work — we handle the structuring." In the pilot, **a human calls the contractor and does the data entry for them**, removing the "extra work" objection for the first 20–30 partners. See `docs/contractor-onepager.md`.

## Chicken-and-egg — solved as a pacing problem, not an ordering problem

Because matching is done by a human, one at a time, supply and demand don't need to be live simultaneously at scale:

1. Recruit the first 5–10 contractors (relationships, cold outreach, local HVAC associations/FB groups) — just enough for any homeowner to get a real bid within hours.
2. Then start homeowner acquisition (Nextdoor, local FB groups, Google/Meta ads: "AC not cooling Dallas") — throttled to match contractor bandwidth.
3. Grow both in lockstep. A human manually matching supply/demand means never showing a homeowner an empty pipeline or a contractor a dead lead.

## What this app build covers vs. not yet

**Built (this pass):** the 4 core screens — Home, Guided Intake, Decision Memo, Job Status — as a React Native (Expo) iOS app, wired to a typed `HomeConciergeApi` contract running against realistic mock/local data (see `mobile/README.md`).

**Not yet built** (flagged here so it isn't lost):
- The mandatory liability click-through disclosure at first use.
- Contractor-facing tooling (the "we do the typing" onboarding/bid-entry flow described in `contractor-onepager.md`) — this pilot assumes an ops person does that outside the app (phone + an internal tool), not homeowner-app screens.
- Real backend: auth, the actual intake→ops-review→contractor-matching pipeline, payment/invoice pass-through, and the trust-graph scoring itself.
- Requests / Messages / Account tabs (stubbed as placeholders in the tab bar for now).
