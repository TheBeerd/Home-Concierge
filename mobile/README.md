# Home Concierge — mobile app

An Expo (React Native) app for the DFW HVAC concierge pilot, targeting iOS first. See [`../docs/product-model.md`](../docs/product-model.md) for the product/business context this is built against, and [`../docs/wireframe.html`](../docs/wireframe.html) for the approved visual design this implements.

## The four core screens

1. **Home** — start a request, see in-progress requests.
2. **Guided intake** — a chat-style Q&A that replaces a phone call, standing in for the human-reviewed AI intake.
3. **Decision memo** — the comparison view: bids side by side, contradictions/outliers flagged, a synthesized (never prescriptive) "our take."
4. **Job status** — appointment timeline plus the homeowner completion confirmation, which is the primary anti-fraud / trust-graph signal.

`Requests`, `Messages`, and `Account` exist only as placeholder tabs so the tab bar matches the design — they're intentionally out of scope for this pass.

## Running it on Ubuntu, on a physical iPhone (Expo Go)

You can't build/run this from inside a Claude Code cloud session — it's an isolated container with no path to your phone. Do this on your own Ubuntu machine instead:

1. **Get the code onto your machine:**
   ```
   git clone https://github.com/TheBeerd/Home-Concierge.git
   cd Home-Concierge
   git checkout claude/pensive-hamilton-2ob9r9
   cd mobile
   ```
2. **Install Node.js 20+** if you don't have it (`node -v` to check), then install deps:
   ```
   npm install
   ```
3. **Install "Expo Go" from the App Store** on the iPhone you're testing with.
4. **Start the dev server:**
   ```
   npx expo start
   ```
   This prints a QR code in the terminal (and opens a dev-tools tab in your browser).
5. **Connect your iPhone:**
   - Put the iPhone on the **same Wi-Fi network** as the Ubuntu machine.
   - Open the iPhone's **Camera** app and point it at the QR code — tap the notification banner to open it in Expo Go. (Or open Expo Go and use its own QR scanner.)
   - The app bundles and loads on your phone in a few seconds. Shake the phone (or the 3-finger tap gesture) to bring up the Expo dev menu, and pull-to-refresh or press `r` in the terminal to reload after edits.
6. **If it won't connect** (phone can't see the QR/LAN address — common on corporate Wi-Fi, VPNs, or if the Ubuntu box's firewall blocks port 8081):
   ```
   npx expo start --tunnel
   ```
   This routes through an ngrok tunnel instead of your LAN — slower to load, but works across networks/firewalls. You may be prompted to install `@expo/ngrok` the first time; let it.
   Alternatively, check `ufw status` and allow the port: `sudo ufw allow 8081/tcp`.

Since this Claude Code environment can't run a simulator itself, changes here are verified with:

```
npx tsc --noEmit          # typecheck
npx expo export --platform ios   # bundles the app; fails loudly on import/config errors
```

— but the real check is loading it in Expo Go as above.

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
