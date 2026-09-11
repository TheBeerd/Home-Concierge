# Home Concierge — mobile app

An Expo (React Native) app for the DFW HVAC concierge pilot, targeting iOS first. See [`../docs/product-model.md`](../docs/product-model.md) for the product/business context this is built against, and [`../docs/wireframe.html`](../docs/wireframe.html) for the approved visual design this implements.

## The four core screens

1. **Home** — start a request, see in-progress requests.
2. **Guided intake** — a chat-style Q&A that replaces a phone call, standing in for the human-reviewed AI intake.
3. **Decision memo** — the comparison view: bids side by side, contradictions/outliers flagged, a synthesized (never prescriptive) "our take."
4. **Job status** — appointment timeline plus the homeowner completion confirmation, which is the primary anti-fraud / trust-graph signal.

`Requests`, `Messages`, and `Account` exist only as placeholder tabs so the tab bar matches the design — they're intentionally out of scope for this pass.

## Running it

```
cd mobile
npm install
npm run ios      # requires macOS + Xcode, or scan the QR code in Expo Go
```

Since this environment can't run a simulator, verify changes with:

```
npx tsc --noEmit          # typecheck
npx expo export --platform ios   # bundles the app; fails loudly on import/config errors
```

## Architecture notes

- **Design tokens** (`src/theme/tokens.ts`) are lifted directly from `docs/wireframe.html`'s CSS variables, so the app matches the reviewed design instead of drifting from it.
- **Domain types** (`src/types/domain.ts`) model the concierge flow: `IntakeSession`, `DecisionMemo`, `Bid`, `JobStatus`, and the `ContractorTrustStats` fields (callback rate, warranty follow-through, quote accuracy) that are the actual moat per the product model.
- **API layer** (`src/api/`) is a typed `HomeConciergeApi` interface with:
  - `mockClient.ts` — the implementation used today, backed by an in-memory scripted intake conversation and the seeded AC-compressor scenario from the wireframe.
  - `restClient.ts` — the shape the real backend client will take; every method is a clearly-marked stub. Swapping it in is a one-line change in `src/api/index.ts` (set `expo.extra.apiBaseUrl` in `app.json`) — no screen needs to change.
- **Screens** (`src/screens/`) only ever talk to `api` from `src/api`, never to the mock/rest classes directly, so that swap stays clean.

## Fonts

Uses `Fraunces` (serif, headings/"our take" accents) and `Inter` (sans, body/UI) via `@expo-google-fonts/*`, matching the wireframe's typography exactly.

## Known gaps (by design, for this pass)

- No camera/mic capture yet — the intake screen's "attach" chips simulate an attachment landing rather than opening the camera/mic, to keep this pass focused on the flow and interaction design. Swapping in `expo-image-picker` / `expo-av` is a contained follow-up.
- No liability disclosure gate, auth, or persistence — see `../docs/product-model.md` for what's intentionally deferred.
