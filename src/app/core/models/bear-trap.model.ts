export type HeroClass = 'Infantry' | 'Lancer' | 'Marksman';
export type TroopType = 'Inf' | 'Lan' | 'Mar';

export const CLASS_TO_TROOP_TYPE: Record<HeroClass, TroopType> = {
  Infantry: 'Inf',
  Lancer: 'Lan',
  Marksman: 'Mar',
};

/** A hero's star + widget level, as entered by the user. 0 stars = not owned/unused. */
export interface HeroLevel {
  name: string;
  stars: number;  // 0–5
  widget: number; // 0–10
}

/** Per-troop-type base stats read off the in-game power screen (account-wide, no heroes). */
export interface BaseStat {
  lethality: number;
  attack: number;
}

export interface BaseStats {
  allTroops: BaseStat;
  inf: BaseStat;
  lanc: BaseStat;
  mark: BaseStat;
}

/** Lethality/Attack read off the gear comparison screen with a troop type's full
 *  gear set equipped, and again with it removed — the app computes the delta
 *  the calculator actually needs (see calculator.service.ts's gearFor()),
 *  rather than asking the user to subtract it themselves. */
export interface GearReading {
  equipped: BaseStat;
  unequipped: BaseStat;
}

export interface GearBonus {
  inf: GearReading;
  lanc: GearReading;
  mark: GearReading;
}

export interface TroopTierSelection {
  inf: string;  // e.g. 'FC5 T10' — see TROOP_TIER_TABLE
  lanc: string;
  mark: string;
}

export interface PetSelection {
  caveLionActive: boolean;
  caveLionLevel: number;   // 1–10
  snowApeActive: boolean;
  snowApeLevel: number;
  sabreToothActive: boolean;
  sabreToothLevel: number;
}

export interface BearTrapInputs {
  squadSize: number;
  baseStats: BaseStats;
  gear: GearBonus;
  troopTiers: TroopTierSelection;
  pets: PetSelection;
  /** Every hero the user owns, with their current star/widget level. Heroes at
   *  0 stars are still listed (so the UI can show them) but contribute no
   *  skill/personal bonus and are excluded from combo search. */
  heroLevels: HeroLevel[];
}

export function defaultBearTrapInputs(heroNames: string[]): BearTrapInputs {
  const zero = (): BaseStat => ({ lethality: 0, attack: 0 });
  const zeroGear = (): GearReading => ({ equipped: zero(), unequipped: zero() });
  return {
    squadSize: 150000,
    baseStats: { allTroops: zero(), inf: zero(), lanc: zero(), mark: zero() },
    gear: { inf: zeroGear(), lanc: zeroGear(), mark: zeroGear() },
    troopTiers: { inf: 'FC5 T10', lanc: 'FC5 T10', mark: 'FC5 T10' },
    pets: {
      caveLionActive: false, caveLionLevel: 1,
      snowApeActive: false, snowApeLevel: 1,
      sabreToothActive: false, sabreToothLevel: 1,
    },
    heroLevels: heroNames.map(name => ({ name, stars: 0, widget: 0 })),
  };
}

export interface LineupResult {
  inf: string;
  lanc: string;
  mark: string;
  /** Overall lineup score — higher is better. Comparable only within the same
   *  BearTrapInputs (squad size, gear, tiers, pets all factor in). */
  score: number;
  /** Optimal troop split for this trio, in whole troops, summing to squadSize. */
  troops: { inf: number; lanc: number; mark: number };
  /** Same split as a ratio (sums to 1). */
  ratio: { inf: number; lanc: number; mark: number };
}
