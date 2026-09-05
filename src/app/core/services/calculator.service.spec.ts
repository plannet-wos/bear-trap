import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';
import { BearTrapInputs, HeroLevel, defaultBearTrapInputs } from '../models/bear-trap.model';
import { BEAR_TRAP_HEROES } from '../data/heroes';

/**
 * Cross-checked against the source spreadsheet's cached values for
 * Jeronimo (Inf) / Mia (Lanc) / Gwen (Mark), no joiners, no pets, no gear:
 *
 *   'Bear model' row 5 (Jeronimo/Mia/Gwen + Jessie x4 joiners) cached:
 *     Z5 (InfLethality factor, WITH joiners)      = 2.15
 *     Jessie's own Skill-1 InfLethality (joiner)  = 0.25  ('Skill stats backend'!C10)
 *     2.15 - 4*0.25 = 1.15  == our no-joiner factor (1 + Jeronimo's 0.15, level 3)
 *   AA5 (Attack factor)      = 1.15   -- matches exactly, no joiner contribution
 *   AB5 (DamageTakenUp)      = 1.265  -- matches exactly (Gwen level 5 = 0.265)
 *   AC5 (DefenseDown)        = 1      -- matches exactly
 *   AF5 (SkillDamageAdds)    = 1.35   -- matches exactly (Mia 0.25 + Gwen 0.10)
 *   AH5 (DamageMultiply)     = 1.4941 -- matches exactly, no joiner interference
 *     (Jeronimo level 3: 0.072, Mia level 5: 0.39375 -> 1.072*1.39375 = 1.4941)
 *   P5  (Jeronimo's own (1+Lethality)*(1+Attack))  = 34.7356
 *     -- matches (1+4.8817)*(1+4.9057) from 'Enter stats + results' roster cache
 *
 * See calculator.service.ts's header comments for the full formula.
 */
describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  function heroLevel(name: string, stars: number, widget: number): HeroLevel {
    return { name, stars, widget };
  }

  function baseInputs(): BearTrapInputs {
    const inputs = defaultBearTrapInputs(BEAR_TRAP_HEROES.map(h => h.name));
    inputs.squadSize = 100000;
    inputs.troopTiers = { inf: 'FC0 T1', lanc: 'FC0 T1', mark: 'FC0 T1' };
    return inputs;
  }

  it('reproduces the spreadsheet-verified skill-coefficient factors for Jeronimo/Mia/Gwen', () => {
    const inputs = baseInputs();
    const inf = heroLevel('Jeronimo', 2, 0); // level = min(2+1,5) = 3
    const lanc = heroLevel('Mia', 4, 0);     // level = min(4+1,5) = 5
    const mark = heroLevel('Gwen', 4, 0);    // level = min(4+1,5) = 5

    const result = service.scoreLineup(inf, lanc, mark, inputs, inputs.squadSize);

    expect(result.score).toBeGreaterThan(0);
    expect(result.troops.inf + result.troops.lanc + result.troops.mark).toBeCloseTo(inputs.squadSize, -1);
    // Deterministic regression guard: independently recomputed in Python from the
    // same extracted data (see the extraction notes in this repo's history) —
    // matches to 4 decimal places.
    expect(result.score).toBeCloseTo(13.7434, 3);
    expect(result.troops).toEqual({ inf: 703, lanc: 17184, mark: 82113 });
  });

  it('finds and ranks lineups among owned heroes only', () => {
    const inputs = baseInputs();
    inputs.heroLevels = inputs.heroLevels.map(h => {
      if (h.name === 'Jeronimo') return { ...h, stars: 5, widget: 5 };
      if (h.name === 'Mia') return { ...h, stars: 5, widget: 5 };
      if (h.name === 'Gwen') return { ...h, stars: 5, widget: 5 };
      if (h.name === 'Flint') return { ...h, stars: 1, widget: 0 };
      return h;
    });

    const results = service.findBestLineups(inputs, 5);

    expect(results.length).toBeGreaterThan(0);
    // Only Jeronimo/Flint (Infantry) are owned, only Mia (Lancer), only Gwen (Marksman).
    for (const r of results) {
      expect(['Jeronimo', 'Flint']).toContain(r.inf);
      expect(r.lanc).toBe('Mia');
      expect(r.mark).toBe('Gwen');
    }
    // Sorted descending by score.
    expect(results[0].score).toBeGreaterThanOrEqual(results[results.length - 1].score);
  });

  it('increases squad size when Snow Ape is active', () => {
    const inputs = baseInputs();
    inputs.squadSize = 100000;
    inputs.pets.snowApeActive = true;
    inputs.pets.snowApeLevel = 5;
    expect(service.effectiveSquadSize(inputs)).toBe(107500);
  });
});
