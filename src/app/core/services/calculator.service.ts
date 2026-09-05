import { Injectable } from '@angular/core';

import {
  BaseStat,
  BearTrapInputs,
  HeroLevel,
  LineupResult,
  TroopType,
} from '../models/bear-trap.model';
import { BEAR_TRAP_HEROES, BearTrapHero } from '../data/heroes';
import { WIDGET_SKILL_EFFECTS, SkillMetric } from '../data/widget-skill-effects';
import { ATTACK_BY_STAR } from '../data/attack-by-star';
import { GEN_LETHALITY_COEFF } from '../data/gen-lethality-coeff';
import { TROOP_TIER_TABLE } from '../data/troop-tier-table';
import { PET_TABLE } from '../data/pet-table';
import { SQUAD_WEIGHTS } from '../data/squad-weights';

const TROOP_TYPES: TroopType[] = ['Inf', 'Lan', 'Mar'];

/** A hero's skill level (1-5) used to look up WIDGET_SKILL_EFFECTS, derived from
 *  star count. 0 stars -> level 0 -> no exclusive-skill bonus at all (matches
 *  the spreadsheet's "Assumed skill level" column: MID(star,1,1)+1, capped 5). */
function skillLevel(stars: number): number {
  if (stars <= 0) return 0;
  return Math.min(Math.floor(stars) + 1, 5);
}

function widgetEffect(hero: HeroLevel, type: TroopType, metric: SkillMetric): number {
  const level = skillLevel(hero.stars);
  if (level === 0) return 0;
  return WIDGET_SKILL_EFFECTS[hero.name]?.[String(level)]?.[type]?.[metric] ?? 0;
}

/** Widget-level bracket used by the "rally leader" flat Lethality/Attack bonus:
 *  0% below widget 2, then 5/7.5/10/12.5/15% in steps of 2 widget levels.
 *  Source: 'Enter stats + results'!U19/V19. */
function rallyBracket(widget: number): number {
  if (widget < 2) return 0;
  if (widget < 4) return 0.05;
  if (widget < 6) return 0.075;
  if (widget < 8) return 0.10;
  if (widget < 10) return 0.125;
  return 0.15;
}

function heroByName(name: string): BearTrapHero | undefined {
  return BEAR_TRAP_HEROES.find(h => h.name === name);
}

function baseStatFor(type: TroopType, inputs: BearTrapInputs): BaseStat {
  const perType = type === 'Inf' ? inputs.baseStats.inf : type === 'Lan' ? inputs.baseStats.lanc : inputs.baseStats.mark;
  const all = inputs.baseStats.allTroops;
  return { lethality: perType.lethality + all.lethality, attack: perType.attack + all.attack };
}

/** The delta the calculator actually needs — equipped minus unequipped — from
 *  the two raw readings the user enters (see GearReading's doc comment). */
function gearFor(type: TroopType, inputs: BearTrapInputs): BaseStat {
  const reading = type === 'Inf' ? inputs.gear.inf : type === 'Lan' ? inputs.gear.lanc : inputs.gear.mark;
  return {
    lethality: reading.equipped.lethality - reading.unequipped.lethality,
    attack: reading.equipped.attack - reading.unequipped.attack,
  };
}

function petBonus(level: number, key: 'caveLion' | 'snowApe' | 'sabreTooth'): number {
  return PET_TABLE.find(p => p.level === level)?.[key] ?? 0;
}

function troopTierMultiplier(key: string, type: TroopType): number {
  const row = TROOP_TIER_TABLE.find(r => r.key === key);
  if (!row) return 0;
  return type === 'Inf' ? row.inf : type === 'Lan' ? row.lanc : row.mark;
}

@Injectable({ providedIn: 'root' })
export class CalculatorService {
  /**
   * (1 + hero's own Lethality) and (1 + hero's own Attack), each folded together
   * with the matching pet bonus (Sabre-tooth Tiger -> Lethality, Cave Lion ->
   * Attack) as (1+raw)*(1+petBonus) — identical to how
   * 'Enter stats + results'!Y19/Z19 combine hero stat + pet.
   */
  private personalFactor(hero: HeroLevel, type: TroopType, inputs: BearTrapInputs): number {
    const base = heroByName(hero.name);
    if (!base) return 1;

    const ownLethality = hero.widget * (GEN_LETHALITY_COEFF[String(base.gen)] ?? 0);
    const ownAttack = ATTACK_BY_STAR[hero.name]?.[String(Math.floor(hero.stars))] ?? 0;

    const baseStat = baseStatFor(type, inputs);
    const gear = gearFor(type, inputs);

    const rawLeth = ownLethality + baseStat.lethality + gear.lethality;
    const rawAtk = ownAttack + baseStat.attack + gear.attack;

    const sabreToothBonus = inputs.pets.sabreToothActive ? petBonus(inputs.pets.sabreToothLevel, 'sabreTooth') : 0;
    const caveLionBonus = inputs.pets.caveLionActive ? petBonus(inputs.pets.caveLionLevel, 'caveLion') : 0;

    const lethFactor = (1 + rawLeth) * (1 + sabreToothBonus);
    const atkFactor = (1 + rawAtk) * (1 + caveLionBonus);
    return lethFactor * atkFactor;
  }

  /** Combined multiplicative bonus from all three heroes' exclusive skills on
   *  troop-type `type`'s effective damage. Mirrors Bear model's Z:AH factors. */
  private skillCoefficient(heroes: HeroLevel[], type: TroopType): number {
    const sum = (metric: SkillMetric) =>
      1 + heroes.reduce((s, h) => s + widgetEffect(h, type, metric), 0);
    const productMultiply = heroes.reduce((p, h) => p * (1 + widgetEffect(h, type, 'DamageMultiply')), 1);

    const factorLeth = sum('Lethality');
    const factorAtk = sum('Attack');
    const factorDmgTakenUp = sum('DamageTakenUp');
    const factorDefDown = sum('DefenseDown');

    const factorNormalDmg = sum('NormalDamage');
    const factorChanceDmg = sum('ChanceDamage');
    const factorSkillDmgAdds = sum('SkillDamageAdds');
    const factorSkillDmgWuMing = sum('SkillDamageWuMing');
    const specialTerm =
      1 + (factorNormalDmg - 1) + (factorSkillDmgAdds * factorChanceDmg - 1) * factorSkillDmgWuMing;

    return factorLeth * factorAtk * factorDmgTakenUp * factorDefDown * productMultiply * specialTerm;
  }

  /** Rally-leader flat bonus: sum, over the 3 heroes, of their widget-bracket %
   *  bonus IF their exclusive skill also grants the "rally leader" flag. */
  private rallyBonus(infHero: HeroLevel, lancHero: HeroLevel, markHero: HeroLevel): { leth: number; atk: number } {
    let leth = 0, atk = 0;
    for (const h of [infHero, lancHero, markHero]) {
      const base = heroByName(h.name);
      if (!base) continue;
      const bracket = rallyBracket(h.widget);
      leth += base.rallyLeth * bracket;
      atk += base.rallyAtk * bracket;
    }
    return { leth, atk };
  }

  /**
   * Scores one Infantry/Lancer/Marksman trio and finds its optimal troop
   * split. squadSize already includes any active Snow Ape bonus — see
   * `effectiveSquadSize()`.
   */
  scoreLineup(infHero: HeroLevel, lancHero: HeroLevel, markHero: HeroLevel, inputs: BearTrapInputs, squadSize: number): LineupResult {
    const heroes = [infHero, lancHero, markHero];
    const slotHero: Record<TroopType, HeroLevel> = { Inf: infHero, Lan: lancHero, Mar: markHero };
    const tierKey: Record<TroopType, string> = { Inf: inputs.troopTiers.inf, Lan: inputs.troopTiers.lanc, Mar: inputs.troopTiers.mark };

    // S(t): each troop type's effective damage coefficient — skill effects from
    // all 3 heroes combined multiplicatively with the slot hero's own stat.
    const S: Record<TroopType, number> = { Inf: 0, Lan: 0, Mar: 0 };
    const ThD: Record<TroopType, number> = { Inf: 0, Lan: 0, Mar: 0 };
    for (const t of TROOP_TYPES) {
      S[t] = this.skillCoefficient(heroes, t) * this.personalFactor(slotHero[t], t, inputs);
      ThD[t] = S[t] * troopTierMultiplier(tierKey[t], t);
    }

    // Optimal troop split: maximizing sum(ThD_t * sqrt(troops_t)) subject to
    // sum(troops_t) = squadSize gives troops_t proportional to ThD_t^2 (Lagrange
    // multiplier on sqrt) — the closed-form the spreadsheet's TRAT sheets
    // approximate via a 400-row iterative hill-climb.
    const sqSum = ThD.Inf ** 2 + ThD.Lan ** 2 + ThD.Mar ** 2;
    const ratio = sqSum > 0
      ? { inf: ThD.Inf ** 2 / sqSum, lanc: ThD.Lan ** 2 / sqSum, mark: ThD.Mar ** 2 / sqSum }
      : { inf: 1 / 3, lanc: 1 / 3, mark: 1 / 3 };
    const troops = {
      inf: Math.round(ratio.inf * squadSize),
      lanc: Math.round(ratio.lanc * squadSize),
      mark: Math.round(ratio.mark * squadSize),
    };

    // Final score: a weighted average of S(t) (not ThD(t)) using the optimized
    // troop counts and a fixed reference-composition weight per type — mirrors
    // Bear model!L4 exactly, including the multiplicative rally-leader bonus.
    const w = (t: TroopType, n: number) => (t === 'Inf' ? SQUAD_WEIGHTS.inf : t === 'Lan' ? SQUAD_WEIGHTS.lanc : SQUAD_WEIGHTS.mark) * Math.sqrt(n);
    const wInf = w('Inf', troops.inf), wLan = w('Lan', troops.lanc), wMar = w('Mar', troops.mark);
    const denom = wInf + wLan + wMar;
    const weightedAvgS = denom > 0 ? (S.Inf * wInf + S.Lan * wLan + S.Mar * wMar) / denom : 0;

    const rally = this.rallyBonus(infHero, lancHero, markHero);
    const score = weightedAvgS * (1 + rally.leth) * (1 + rally.atk);

    return {
      inf: infHero.name,
      lanc: lancHero.name,
      mark: markHero.name,
      score,
      troops,
      ratio,
    };
  }

  /** Squad size after any active Snow Ape flat troop-capacity bonus. */
  effectiveSquadSize(inputs: BearTrapInputs): number {
    const snowApe = inputs.pets.snowApeActive ? petBonus(inputs.pets.snowApeLevel, 'snowApe') : 0;
    return Math.round(inputs.squadSize + snowApe);
  }

  /**
   * Tries every Infantry x Lancer x Marksman combination among owned heroes
   * (stars >= 1), ranked by score descending. Joiners are intentionally out of
   * scope — see the app's README.
   */
  findBestLineups(inputs: BearTrapInputs, limit = 10): LineupResult[] {
    const owned = inputs.heroLevels.filter(h => h.stars >= 1);
    const byClass = (cls: 'Infantry' | 'Lancer' | 'Marksman') =>
      owned.filter(h => heroByName(h.name)?.class === cls);

    const infantry = byClass('Infantry');
    const lancers = byClass('Lancer');
    const marksmen = byClass('Marksman');
    const squadSize = this.effectiveSquadSize(inputs);

    const results: LineupResult[] = [];
    for (const inf of infantry) {
      for (const lanc of lancers) {
        for (const mark of marksmen) {
          results.push(this.scoreLineup(inf, lanc, mark, inputs, squadSize));
        }
      }
    }
    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
