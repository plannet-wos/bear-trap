# Bear Trap Calculator - Claude AI Context

## What This App Is
Bear Trap Calculator is a client-side web app for **Whiteout Survival** that finds a player's
optimal Bear Trap hero lineup (Infantry/Lancer/Marksman trio) and the troop ratio to run it at.
Users enter their account stats, gear, troop tiers, pets, and each hero's star/widget level; the
app brute-forces every combination among owned heroes and ranks them by score.

Live: **https://wos-bear-trap.web.app**
Part of the **[Plannet WOS](https://plannet-wos.web.app)** suite.

---

## Non-Negotiable Rules

1. **Framework:** Angular 21, Standalone Components only. No NgModule.
2. **UI:** Angular Material + Angular CDK. No other UI libraries.
3. **State management:** Angular signals only. No RxJS for component state.
4. **All calculation is client-side.** No backend, no server calls for the calculator itself. The
   only server-side dependency is Firestore for the save-code feature (read/write a 4-char code →
   JSON blob of the user's inputs, see `core/services/save-code.service.ts`).
5. **Deployment:** Firebase Hosting, site name `wos-bear-trap`. Firestore rules for the
   `bear_trap_saves` collection live in the `plannet-wos` repo (sole owner/deployer of the shared
   `tal-coordinator` project's `firestore.rules`) — this repo has no local copy and
   `firebase deploy` here only ever touches hosting.
6. **No authentication.** The calculator is a public tool, no login required.
7. **No joiners, no minister buff.** Deliberately out of scope for v1 — see the model notes in
   `core/services/calculator.service.ts` and README.md before adding them.

---

## Project Structure

```
src/app/
  features/
    bear-trap/
      bear-trap.ts/.html/.scss    # Main (and only) page component
  core/
    models/
      bear-trap.model.ts          # All interfaces + defaultBearTrapInputs()
    data/
      heroes.ts                   # Roster: name, class, gen, rally-leader flags
      widget-skill-effects.ts     # Per-hero exclusive-skill effects by level (1-5)
      attack-by-star.ts           # Per-hero personal Attack % by whole star level (0-5)
      gen-lethality-coeff.ts      # Per-generation Lethality-per-widget-level coefficient
      troop-tier-table.ts         # FC x Tier -> per-type damage multiplier (121 rows)
      pet-table.ts                # Cave Lion / Snow Ape / Sabre-tooth Tiger bonus by level
      squad-weights.ts            # Reference troop-composition weights used in scoring
    services/
      calculator.service.ts       # Scoring engine + combo search — see its header comments
      save-code.service.ts        # Firestore-backed 4-char codes for share/reload
  shared/
    app-switcher/app-switcher.ts  # FAB linking back to Plannet WOS
```

All data in `core/data/` was extracted from a community spreadsheet ("Rainbow Valley's WoS bear
hunt hero skill & troop ratio calculator V5a", hero star data credited to el3ctre) and validated
against its cached values — see calculator.service.ts's header comments for the exact formulas
and what was verified.

---

## What to Avoid

- Do not add NgModules.
- Do not add a backend or server-side processing.
- Do not re-introduce zone.js.
- Do not add joiners or the minister buff without re-reading the model notes first — both were
  deliberately scoped out, not overlooked.
- Do not add extra abstractions not required by the task at hand.
