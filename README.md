# Bear Trap Calculator

A client-side web app for **Whiteout Survival** that finds your optimal Bear Trap hero lineup
and the troop ratio to run it at. Enter your account stats, gear, troop tiers and pets, plus your
heroes' star and widget levels — the app checks every Infantry/Lancer/Marksman combination among
your owned heroes and ranks them by score, with the exact troop split for each.

Live: **https://bear-trap.web.app**
Part of the **[Plannet WOS](https://plannet-wos.web.app)** suite.

## Model

Ported from a community spreadsheet ("Rainbow Valley's WoS bear hunt hero skill & troop ratio
calculator", credited to el3ctre for hero star data). Two factors drive a hero's contribution:

- **Native skill effects** — each hero has 3 skills, all unlocked and leveled together purely by
  star count (0★ already has Skill 1 at level 1, capping at level 5 by 4★), buffing troop-type
  stats (Lethality, Attack, damage-taken-up, defense-down, skill-damage chance/multiplier, etc.).
  This is the dominant factor and is modeled exactly as the sum of the hero's 3 skills at their
  current level (`core/data/hero-skill-effects.ts`).
- **Personal stat growth** — each hero's own flat Lethality (from widget level × a generation
  coefficient) and Attack (a hand-curated per-hero, per-star-level table) contribute a smaller
  amount on top.

The optimal troop ratio has a closed form: for troop types with effective-damage coefficients
`ThD_inf, ThD_lanc, ThD_mark`, the score `Σ ThD_t · sqrt(troops_t)` is maximized (subject to a
fixed squad size) when `troops_t ∝ ThD_t²`. The original spreadsheet approximates this with a
400-row-per-lineup iterative hill-climb; this app computes it directly.

**Scope vs. the spreadsheet:** joiners (4 extra support heroes per lineup) and the minister buff
are intentionally not modeled — see `core/services/calculator.service.ts` for the full formula
and validation notes.

## Setup

```bash
npm install
npm start
```

Then open `http://localhost:4200/`.

## Firebase config

The Firebase web API key in `src/environments/environment.ts` is intentionally checked in (same
public-key-is-fine model as the rest of the suite — see plannet-wos/README.md).

### Firestore rules ownership

This repo does **not** own `firestore.rules` — like every sister app except the plannet-wos hub,
it only ever runs `firebase deploy --only hosting`. The `bear_trap_saves` collection (used by the
save-code feature) is defined in [plannet-wos/firestore.rules](https://github.com/plannet-wos/plannet-wos/blob/main/firestore.rules).
To change that collection's rules, edit it there — see that repo's README.

## Deploying

Every push to `main` auto-deploys via `.github/workflows/deploy.yml`: build, then
`FirebaseExtended/action-hosting-deploy` for Hosting only — this repo doesn't own Firestore rules
(see above), so there's no rules-deploy step here unlike the plannet-wos hub repo. Authenticates
with the org-level `FIREBASE_SERVICE_ACCOUNT` secret shared across the plannet-wos repos.

## Contributing

Fork the repo, create a branch, open a PR. No write access needed.
