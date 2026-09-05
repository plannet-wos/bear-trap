// Each hero's exclusive/widget skill effect on troop-type combat stats, by
// skill level (1-5, derived from star count: level = min(stars+1, 5), 0 stars =
// no entry = no bonus). This is the dominant factor in a hero's Bear Trap score.
//
// Source: 'Skill stats backend' sheet, 4th column-group (the widget-exclusive
// skill), across its 5 level row-blocks. Metrics match Bear model's Z:AH factors:
//   Lethality/Attack (adds), DamageTakenUp/DefenseDown (adds, squad-wide debuffs
//   the hero applies), ChanceDamage/NormalDamage/SkillDamageAdds/SkillDamageWuMing
//   (the skill-damage-chance mechanic — Reina/Wu Ming-style effects), and
//   DamageMultiply (a flat final multiplier, combined via PRODUCT not sum).
// Heroes/metrics not listed default to 0 (no effect).
import { TroopType } from '../models/bear-trap.model';

export type SkillMetric =
  | 'Lethality' | 'Attack' | 'DamageTakenUp' | 'DefenseDown'
  | 'ChanceDamage' | 'NormalDamage' | 'SkillDamageAdds'
  | 'SkillDamageWuMing' | 'DamageMultiply';

type SkillEffectsByType = Partial<Record<TroopType, Partial<Record<SkillMetric, number>>>>;

export const WIDGET_SKILL_EFFECTS: Record<string, Record<string, SkillEffectsByType>> = {
  "Ahmose": {
    '1': { Inf: { Lethality: 0.2, SkillDamageAdds: 0.12, DamageMultiply: 0.005 }, Lan: { DamageMultiply: 0.005 }, Mar: { DamageMultiply: 0.005 } },
    '2': { Inf: { Lethality: 0.4, SkillDamageAdds: 0.24, DamageMultiply: 0.01 }, Lan: { DamageMultiply: 0.01 }, Mar: { DamageMultiply: 0.01 } },
    '3': { Inf: { Lethality: 0.6, SkillDamageAdds: 0.36, DamageMultiply: 0.3804 }, Lan: { DamageMultiply: 0.015 }, Mar: { DamageMultiply: 0.015 } },
    '4': { Inf: { Lethality: 0.8, SkillDamageAdds: 0.48, DamageMultiply: 0.5096 }, Lan: { DamageMultiply: 0.02 }, Mar: { DamageMultiply: 0.02 } },
    '5': { Inf: { Lethality: 1, SkillDamageAdds: 0.6, DamageMultiply: 0.025 }, Lan: { DamageMultiply: 0.025 }, Mar: { DamageMultiply: 0.025 } },
  },
  "Alonso": {
    '1': { Inf: { ChanceDamage: 0.05, DamageMultiply: 0.04 }, Lan: { ChanceDamage: 0.05, DamageMultiply: 0.04 }, Mar: { ChanceDamage: 0.05, DamageMultiply: 0.04 } },
    '2': { Inf: { ChanceDamage: 0.1, DamageMultiply: 0.08 }, Lan: { ChanceDamage: 0.1, DamageMultiply: 0.08 }, Mar: { ChanceDamage: 0.1, DamageMultiply: 0.08 } },
    '3': { Inf: { ChanceDamage: 0.15, DamageMultiply: 0.12 }, Lan: { ChanceDamage: 0.15, DamageMultiply: 0.12 }, Mar: { ChanceDamage: 0.15, DamageMultiply: 0.12 } },
    '4': { Inf: { ChanceDamage: 0.2, DamageMultiply: 0.16 }, Lan: { ChanceDamage: 0.2, DamageMultiply: 0.16 }, Mar: { ChanceDamage: 0.2, DamageMultiply: 0.16 } },
    '5': { Inf: { ChanceDamage: 0.25, DamageMultiply: 0.2 }, Lan: { ChanceDamage: 0.25, DamageMultiply: 0.2 }, Mar: { ChanceDamage: 0.25, DamageMultiply: 0.2 } },
  },
  "Blanchette": {
    '1': { Inf: { Lethality: 0.05 }, Lan: { Lethality: 0.05 }, Mar: { Lethality: 0.05, ChanceDamage: 0.045 } },
    '2': { Inf: { Lethality: 0.1 }, Lan: { Lethality: 0.1 }, Mar: { Lethality: 0.1, ChanceDamage: 0.09 } },
    '3': { Inf: { Lethality: 0.15 }, Lan: { Lethality: 0.15 }, Mar: { Lethality: 0.15, ChanceDamage: 0.135 } },
    '4': { Inf: { Lethality: 0.2 }, Lan: { Lethality: 0.2 }, Mar: { Lethality: 0.2, ChanceDamage: 0.18 } },
    '5': { Inf: { Lethality: 0.25 }, Lan: { Lethality: 0.25 }, Mar: { Lethality: 0.25, ChanceDamage: 0.225 } },
  },
  "Bradley": {
    '1': { Inf: { Attack: 0.05, DamageTakenUp: 0.05, DamageMultiply: 0.024 }, Lan: { Attack: 0.05, DamageTakenUp: 0.05, DamageMultiply: 0.024 }, Mar: { Attack: 0.05, DamageTakenUp: 0.04545454545, DamageMultiply: 0.024 } },
    '2': { Inf: { Attack: 0.1, DamageTakenUp: 0.1, DamageMultiply: 0.048 }, Lan: { Attack: 0.1, DamageTakenUp: 0.1, DamageMultiply: 0.048 }, Mar: { Attack: 0.1, DamageTakenUp: 0.09090909091, DamageMultiply: 0.048 } },
    '3': { Inf: { Attack: 0.15, DamageTakenUp: 0.15, DamageMultiply: 0.072 }, Lan: { Attack: 0.15, DamageTakenUp: 0.15, DamageMultiply: 0.072 }, Mar: { Attack: 0.15, DamageTakenUp: 0.1363636364, DamageMultiply: 0.072 } },
    '4': { Inf: { Attack: 0.2, DamageTakenUp: 0.2, DamageMultiply: 0.096 }, Lan: { Attack: 0.2, DamageTakenUp: 0.2, DamageMultiply: 0.096 }, Mar: { Attack: 0.2, DamageTakenUp: 0.1818181818, DamageMultiply: 0.096 } },
    '5': { Inf: { Attack: 0.25, DamageTakenUp: 0.25, DamageMultiply: 0.12 }, Lan: { Attack: 0.25, DamageTakenUp: 0.25, DamageMultiply: 0.12 }, Mar: { Attack: 0.25, DamageTakenUp: 0.2272727273, DamageMultiply: 0.12 } },
  },
  "Cara": {
    '1': { Inf: { NormalDamage: 0.1 }, Lan: { NormalDamage: 0.1 }, Mar: { NormalDamage: 0.1 } },
    '2': { Inf: { NormalDamage: 0.15 }, Lan: { NormalDamage: 0.15 }, Mar: { NormalDamage: 0.15 } },
    '3': { Inf: { NormalDamage: 0.2 }, Lan: { NormalDamage: 0.2 }, Mar: { NormalDamage: 0.2 } },
    '4': { Inf: { NormalDamage: 0.25 }, Lan: { NormalDamage: 0.25 }, Mar: { NormalDamage: 0.25 } },
    '5': { Inf: { NormalDamage: 0.3 }, Lan: { NormalDamage: 0.3 }, Mar: { NormalDamage: 0.3 } },
  },
  "Dominic": {
    '1': { Inf: { DamageTakenUp: 0.045, DamageMultiply: 0.0712 }, Lan: { DamageTakenUp: 0.045, ChanceDamage: 0.12, DamageMultiply: 0.04 }, Mar: { DamageTakenUp: 0.045, DamageMultiply: 0.0712 } },
    '2': { Inf: { DamageTakenUp: 0.09, DamageMultiply: 0.1448 }, Lan: { DamageTakenUp: 0.09, ChanceDamage: 0.24, DamageMultiply: 0.08 }, Mar: { DamageTakenUp: 0.09, DamageMultiply: 0.1448 } },
    '3': { Inf: { DamageTakenUp: 0.135, DamageMultiply: 0.2208 }, Lan: { DamageTakenUp: 0.135, ChanceDamage: 0.36, DamageMultiply: 0.12 }, Mar: { DamageTakenUp: 0.135, DamageMultiply: 0.2208 } },
    '4': { Inf: { DamageTakenUp: 0.18, DamageMultiply: 0.2992 }, Lan: { DamageTakenUp: 0.18, ChanceDamage: 0.48, DamageMultiply: 0.16 }, Mar: { DamageTakenUp: 0.18, DamageMultiply: 0.2992 } },
    '5': { Inf: { DamageTakenUp: 0.225, DamageMultiply: 0.38 }, Lan: { DamageTakenUp: 0.225, ChanceDamage: 0.6, DamageMultiply: 0.2 }, Mar: { DamageTakenUp: 0.225, DamageMultiply: 0.38 } },
  },
  "Edith": {
    '1': { Lan: { DamageMultiply: 0.04 } },
    '2': { Lan: { DamageMultiply: 0.08 } },
    '3': { Lan: { DamageMultiply: 0.12 } },
    '4': { Lan: { DamageMultiply: 0.16 } },
    '5': { Lan: { DamageMultiply: 0.2 } },
  },
  "Eleonora": {
    '1': { Inf: { DamageMultiply: 0.01 }, Lan: { DamageMultiply: 0.01 }, Mar: { DamageMultiply: 0.0302 } },
    '2': { Inf: { DamageMultiply: 0.02 }, Lan: { DamageMultiply: 0.02 }, Mar: { DamageMultiply: 0.0608 } },
    '3': { Inf: { DamageMultiply: 0.03 }, Lan: { DamageMultiply: 0.03 }, Mar: { DamageMultiply: 0.0918 } },
    '4': { Inf: { DamageMultiply: 0.04 }, Lan: { DamageMultiply: 0.04 }, Mar: { DamageMultiply: 0.1232 } },
    '5': { Inf: { DamageMultiply: 0.05 }, Lan: { DamageMultiply: 0.05 }, Mar: { DamageMultiply: 0.155 } },
  },
  "Elif": {
    '1': { Inf: { Attack: 0.03 }, Lan: { Attack: 0.03 }, Mar: { Attack: 0.03 } },
    '2': { Inf: { Attack: 0.06 }, Lan: { Attack: 0.06 }, Mar: { Attack: 0.06 } },
    '3': { Inf: { Attack: 0.09 }, Lan: { Attack: 0.09 }, Mar: { Attack: 0.09 } },
    '4': { Inf: { Attack: 0.12 }, Lan: { Attack: 0.12 }, Mar: { Attack: 0.12 } },
    '5': { Inf: { Attack: 0.15 }, Lan: { Attack: 0.15 }, Mar: { Attack: 0.15 } },
  },
  "Estrella": {
    '1': { Inf: { Attack: 0.03, DefenseDown: 0.05 }, Lan: { Attack: 0.03, DefenseDown: 0.05, DamageMultiply: 0.05 }, Mar: { Attack: 0.03, DefenseDown: 0.05 } },
    '2': { Inf: { Attack: 0.06, DefenseDown: 0.1 }, Lan: { Attack: 0.06, DefenseDown: 0.1, DamageMultiply: 0.1 }, Mar: { Attack: 0.06, DefenseDown: 0.1 } },
    '3': { Inf: { Attack: 0.09, DefenseDown: 0.15 }, Lan: { Attack: 0.09, DefenseDown: 0.15, DamageMultiply: 0.15 }, Mar: { Attack: 0.09, DefenseDown: 0.15 } },
    '4': { Inf: { Attack: 0.12, DefenseDown: 0.2 }, Lan: { Attack: 0.12, DefenseDown: 0.2, DamageMultiply: 0.2 }, Mar: { Attack: 0.12, DefenseDown: 0.2 } },
    '5': { Inf: { Attack: 0.15, DefenseDown: 0.25 }, Lan: { Attack: 0.15, DefenseDown: 0.25, DamageMultiply: 0.25 }, Mar: { Attack: 0.15, DefenseDown: 0.25 } },
  },
  "Flint": {
    '1': { Inf: { Lethality: 0.05, Attack: 0.05, DamageMultiply: 0.2 }, Lan: { Lethality: 0.05, Attack: 0.05 }, Mar: { Lethality: 0.05, Attack: 0.05 } },
    '2': { Inf: { Lethality: 0.1, Attack: 0.1, DamageMultiply: 0.4 }, Lan: { Lethality: 0.1, Attack: 0.1 }, Mar: { Lethality: 0.1, Attack: 0.1 } },
    '3': { Inf: { Lethality: 0.15, Attack: 0.15, DamageMultiply: 0.6 }, Lan: { Lethality: 0.15, Attack: 0.15 }, Mar: { Lethality: 0.15, Attack: 0.15 } },
    '4': { Inf: { Lethality: 0.2, Attack: 0.2, DamageMultiply: 0.8 }, Lan: { Lethality: 0.2, Attack: 0.2 }, Mar: { Lethality: 0.2, Attack: 0.2 } },
    '5': { Inf: { Lethality: 0.25, Attack: 0.25, DamageMultiply: 1 }, Lan: { Lethality: 0.25, Attack: 0.25 }, Mar: { Lethality: 0.25, Attack: 0.25 } },
  },
  "Flora": {
    '1': { Inf: { DamageMultiply: 0.07875 }, Lan: { DamageMultiply: 0.1326875 }, Mar: { DamageMultiply: 0.07875 } },
    '2': { Inf: { DamageMultiply: 0.1575 }, Lan: { DamageMultiply: 0.27325 }, Mar: { DamageMultiply: 0.1575 } },
    '3': { Inf: { DamageMultiply: 0.23625 }, Lan: { DamageMultiply: 0.4216875 }, Mar: { DamageMultiply: 0.23625 } },
    '4': { Inf: { DamageMultiply: 0.315 }, Lan: { DamageMultiply: 0.578 }, Mar: { DamageMultiply: 0.315 } },
    '5': { Inf: { DamageMultiply: 0.39375 }, Lan: { DamageMultiply: 0.7421875 }, Mar: { DamageMultiply: 0.39375 } },
  },
  "Fred": {
    '1': { Inf: { DamageTakenUp: 0.04 }, Lan: { DamageTakenUp: 0.04, ChanceDamage: 0.08 }, Mar: { DamageTakenUp: 0.04 } },
    '2': { Inf: { DamageTakenUp: 0.08 }, Lan: { DamageTakenUp: 0.08, ChanceDamage: 0.16 }, Mar: { DamageTakenUp: 0.08 } },
    '3': { Inf: { DamageTakenUp: 0.12 }, Lan: { DamageTakenUp: 0.12, ChanceDamage: 0.24 }, Mar: { DamageTakenUp: 0.12 } },
    '4': { Inf: { DamageTakenUp: 0.16 }, Lan: { DamageTakenUp: 0.16, ChanceDamage: 0.32 }, Mar: { DamageTakenUp: 0.16 } },
    '5': { Inf: { DamageTakenUp: 0.2 }, Lan: { DamageTakenUp: 0.2, ChanceDamage: 0.4 }, Mar: { DamageTakenUp: 0.2 } },
  },
  "Freya": {
    '1': { Inf: { DamageMultiply: 0.03 }, Lan: { ChanceDamage: 0.1 }, Mar: { DamageMultiply: 0.03 } },
    '2': { Inf: { DamageMultiply: 0.06 }, Lan: { ChanceDamage: 0.2 }, Mar: { DamageMultiply: 0.06 } },
    '3': { Inf: { DamageMultiply: 0.09 }, Lan: { ChanceDamage: 0.3 }, Mar: { DamageMultiply: 0.09 } },
    '4': { Inf: { DamageMultiply: 0.12 }, Lan: { ChanceDamage: 0.4 }, Mar: { DamageMultiply: 0.12 } },
    '5': { Inf: { DamageMultiply: 0.15 }, Lan: { ChanceDamage: 0.5 }, Mar: { DamageMultiply: 0.15 } },
  },
  "Gatot": {
    '1': {  },
    '2': {  },
    '3': {  },
    '4': {  },
    '5': {  },
  },
  "Gisela": {
    '1': {  },
    '2': {  },
    '3': {  },
    '4': {  },
    '5': {  },
  },
  "Gordon": {
    '1': { Inf: { DamageMultiply: 0.03 }, Lan: { DamageMultiply: 0.133 }, Mar: { DamageMultiply: 0.03 } },
    '2': { Inf: { DamageMultiply: 0.06 }, Lan: { DamageMultiply: 0.272 }, Mar: { DamageMultiply: 0.06 } },
    '3': { Inf: { DamageMultiply: 0.09 }, Lan: { DamageMultiply: 0.417 }, Mar: { DamageMultiply: 0.09 } },
    '4': { Inf: { DamageMultiply: 0.12 }, Lan: { DamageMultiply: 0.568 }, Mar: { DamageMultiply: 0.12 } },
    '5': { Inf: { DamageMultiply: 0.15 }, Lan: { DamageMultiply: 0.725 }, Mar: { DamageMultiply: 0.15 } },
  },
  "Greg": {
    '1': { Inf: { DamageMultiply: 0.035712 }, Lan: { DamageMultiply: 0.035712 }, Mar: { DamageMultiply: 0.035712 } },
    '2': { Inf: { DamageMultiply: 0.071424 }, Lan: { DamageMultiply: 0.071424 }, Mar: { DamageMultiply: 0.071424 } },
    '3': { Inf: { DamageMultiply: 0.107136 }, Lan: { DamageMultiply: 0.107136 }, Mar: { DamageMultiply: 0.107136 } },
    '4': { Inf: { DamageMultiply: 0.142848 }, Lan: { DamageMultiply: 0.142848 }, Mar: { DamageMultiply: 0.142848 } },
    '5': { Inf: { DamageMultiply: 0.17856 }, Lan: { DamageMultiply: 0.17856 }, Mar: { DamageMultiply: 0.17856 } },
  },
  "Gregory": {
    '1': { Inf: { Attack: 0.03, ChanceDamage: 0.05 }, Lan: { Attack: 0.03, ChanceDamage: 0.05 }, Mar: { Attack: 0.03, ChanceDamage: 0.05 } },
    '2': { Inf: { Attack: 0.06, ChanceDamage: 0.1 }, Lan: { Attack: 0.06, ChanceDamage: 0.1 }, Mar: { Attack: 0.06, ChanceDamage: 0.1 } },
    '3': { Inf: { Attack: 0.09, ChanceDamage: 0.15 }, Lan: { Attack: 0.09, ChanceDamage: 0.15 }, Mar: { Attack: 0.09, ChanceDamage: 0.15 } },
    '4': { Inf: { Attack: 0.12, ChanceDamage: 0.2 }, Lan: { Attack: 0.12, ChanceDamage: 0.2 }, Mar: { Attack: 0.12, ChanceDamage: 0.2 } },
    '5': { Inf: { Attack: 0.15, ChanceDamage: 0.25 }, Lan: { Attack: 0.15, ChanceDamage: 0.25 }, Mar: { Attack: 0.15, ChanceDamage: 0.25 } },
  },
  "Gwen": {
    '1': { Inf: { DamageTakenUp: 0.053, SkillDamageAdds: 0.02 }, Lan: { DamageTakenUp: 0.053, SkillDamageAdds: 0.02 }, Mar: { DamageTakenUp: 0.053, SkillDamageAdds: 0.02, DamageMultiply: 0.02 } },
    '2': { Inf: { DamageTakenUp: 0.1049, SkillDamageAdds: 0.04 }, Lan: { DamageTakenUp: 0.1049, SkillDamageAdds: 0.04 }, Mar: { DamageTakenUp: 0.1049, SkillDamageAdds: 0.04, DamageMultiply: 0.04 } },
    '3': { Inf: { DamageTakenUp: 0.1585, SkillDamageAdds: 0.06 }, Lan: { DamageTakenUp: 0.1585, SkillDamageAdds: 0.06 }, Mar: { DamageTakenUp: 0.1585, SkillDamageAdds: 0.06, DamageMultiply: 0.06 } },
    '4': { Inf: { DamageTakenUp: 0.2125, SkillDamageAdds: 0.08 }, Lan: { DamageTakenUp: 0.2125, SkillDamageAdds: 0.08 }, Mar: { DamageTakenUp: 0.2125, SkillDamageAdds: 0.08, DamageMultiply: 0.08 } },
    '5': { Inf: { DamageTakenUp: 0.265, SkillDamageAdds: 0.1 }, Lan: { DamageTakenUp: 0.265, SkillDamageAdds: 0.1 }, Mar: { DamageTakenUp: 0.265, SkillDamageAdds: 0.1, DamageMultiply: 0.1 } },
  },
  "Hank": {
    '1': {  },
    '2': {  },
    '3': {  },
    '4': {  },
    '5': {  },
  },
  "Hector": {
    '1': { Inf: { SkillDamageAdds: 0.05, DamageMultiply: 0.214 }, Lan: { SkillDamageAdds: 0.05 }, Mar: { SkillDamageAdds: 0.05, DamageMultiply: 0.107 } },
    '2': { Inf: { SkillDamageAdds: 0.1, DamageMultiply: 0.66875 }, Lan: { SkillDamageAdds: 0.1 }, Mar: { SkillDamageAdds: 0.1, DamageMultiply: 0.214 } },
    '3': { Inf: { SkillDamageAdds: 0.12, DamageMultiply: 0.8025 }, Lan: { SkillDamageAdds: 0.12 }, Mar: { SkillDamageAdds: 0.12, DamageMultiply: 0.321 } },
    '4': { Inf: { SkillDamageAdds: 0.2, DamageMultiply: 0.93625 }, Lan: { SkillDamageAdds: 0.2 }, Mar: { SkillDamageAdds: 0.2, DamageMultiply: 0.428 } },
    '5': { Inf: { SkillDamageAdds: 0.25, DamageMultiply: 1.07 }, Lan: { SkillDamageAdds: 0.25 }, Mar: { SkillDamageAdds: 0.25, DamageMultiply: 0.535 } },
  },
  "Hendrik": {
    '1': { Inf: { DefenseDown: 0.05 }, Lan: { DefenseDown: 0.05 }, Mar: { DefenseDown: 0.05, DamageMultiply: 0.02666666667 } },
    '2': { Inf: { DefenseDown: 0.1 }, Lan: { DefenseDown: 0.1 }, Mar: { DefenseDown: 0.1, DamageMultiply: 0.05333333333 } },
    '3': { Inf: { DefenseDown: 0.15 }, Lan: { DefenseDown: 0.15 }, Mar: { DefenseDown: 0.15, DamageMultiply: 0.08 } },
    '4': { Inf: { DefenseDown: 0.2 }, Lan: { DefenseDown: 0.2 }, Mar: { DefenseDown: 0.2, DamageMultiply: 0.1066666667 } },
    '5': { Inf: { DefenseDown: 0.25 }, Lan: { DefenseDown: 0.25 }, Mar: { DefenseDown: 0.25, DamageMultiply: 0.1333333333 } },
  },
  "Hervor": {
    '1': { Inf: { Lethality: 0.05, DamageMultiply: 0.02 }, Lan: { Lethality: 0.05 }, Mar: { Lethality: 0.05 } },
    '2': { Inf: { Lethality: 0.1, DamageMultiply: 0.04 }, Lan: { Lethality: 0.1 }, Mar: { Lethality: 0.1 } },
    '3': { Inf: { Lethality: 0.15, DamageMultiply: 0.06 }, Lan: { Lethality: 0.15 }, Mar: { Lethality: 0.15 } },
    '4': { Inf: { Lethality: 0.2, DamageMultiply: 0.08 }, Lan: { Lethality: 0.2 }, Mar: { Lethality: 0.2 } },
    '5': { Inf: { Lethality: 0.25, DamageMultiply: 0.1 }, Lan: { Lethality: 0.25 }, Mar: { Lethality: 0.25 } },
  },
  "Jeronimo": {
    '1': { Inf: { Lethality: 0.05, Attack: 0.05, DamageMultiply: 0.024 }, Lan: { Lethality: 0.05, Attack: 0.05, DamageMultiply: 0.024 }, Mar: { Lethality: 0.05, Attack: 0.05, DamageMultiply: 0.024 } },
    '2': { Inf: { Lethality: 0.1, Attack: 0.1, DamageMultiply: 0.048 }, Lan: { Lethality: 0.1, Attack: 0.1, DamageMultiply: 0.048 }, Mar: { Lethality: 0.1, Attack: 0.1, DamageMultiply: 0.048 } },
    '3': { Inf: { Lethality: 0.15, Attack: 0.15, DamageMultiply: 0.072 }, Lan: { Lethality: 0.15, Attack: 0.15, DamageMultiply: 0.072 }, Mar: { Lethality: 0.15, Attack: 0.15, DamageMultiply: 0.072 } },
    '4': { Inf: { Lethality: 0.2, Attack: 0.2, DamageMultiply: 0.096 }, Lan: { Lethality: 0.2, Attack: 0.2, DamageMultiply: 0.096 }, Mar: { Lethality: 0.2, Attack: 0.2, DamageMultiply: 0.096 } },
    '5': { Inf: { Lethality: 0.25, Attack: 0.25, DamageMultiply: 0.12 }, Lan: { Lethality: 0.25, Attack: 0.25, DamageMultiply: 0.12 }, Mar: { Lethality: 0.25, Attack: 0.25, DamageMultiply: 0.12 } },
  },
  "Karol": {
    '1': { Inf: { Attack: 0.03, DamageTakenUp: 0.05 }, Lan: { Attack: 0.03, DamageTakenUp: 0.05 }, Mar: { Attack: 0.03, DamageTakenUp: 0.04545454545 } },
    '2': { Inf: { Attack: 0.06, DamageTakenUp: 0.1 }, Lan: { Attack: 0.06, DamageTakenUp: 0.1 }, Mar: { Attack: 0.06, DamageTakenUp: 0.09090909091 } },
    '3': { Inf: { Attack: 0.09, DamageTakenUp: 0.15 }, Lan: { Attack: 0.09, DamageTakenUp: 0.15 }, Mar: { Attack: 0.09, DamageTakenUp: 0.1363636364 } },
    '4': { Inf: { Attack: 0.12, DamageTakenUp: 0.2 }, Lan: { Attack: 0.12, DamageTakenUp: 0.2 }, Mar: { Attack: 0.12, DamageTakenUp: 0.1818181818 } },
    '5': { Inf: { Attack: 0.15, DamageTakenUp: 0.25 }, Lan: { Attack: 0.15, DamageTakenUp: 0.25 }, Mar: { Attack: 0.15, DamageTakenUp: 0.2272727273 } },
  },
  "Ligeia": {
    '1': { Inf: { DamageTakenUp: 0.02, DefenseDown: 0.05 }, Lan: { DamageTakenUp: 0.02, DefenseDown: 0.05 }, Mar: { DamageTakenUp: 0.02, DefenseDown: 0.05, ChanceDamage: 0.1 } },
    '2': { Inf: { DamageTakenUp: 0.04, DefenseDown: 0.1 }, Lan: { DamageTakenUp: 0.04, DefenseDown: 0.1 }, Mar: { DamageTakenUp: 0.04, DefenseDown: 0.1, ChanceDamage: 0.2 } },
    '3': { Inf: { DamageTakenUp: 0.06, DefenseDown: 0.15 }, Lan: { DamageTakenUp: 0.06, DefenseDown: 0.15 }, Mar: { DamageTakenUp: 0.06, DefenseDown: 0.15, ChanceDamage: 0.3 } },
    '4': { Inf: { DamageTakenUp: 0.08, DefenseDown: 0.2 }, Lan: { DamageTakenUp: 0.08, DefenseDown: 0.2 }, Mar: { DamageTakenUp: 0.08, DefenseDown: 0.2, ChanceDamage: 0.4 } },
    '5': { Inf: { DamageTakenUp: 0.1, DefenseDown: 0.25 }, Lan: { DamageTakenUp: 0.1, DefenseDown: 0.25 }, Mar: { DamageTakenUp: 0.1, DefenseDown: 0.25, ChanceDamage: 0.5 } },
  },
  "Lloyd": {
    '1': { Inf: { DamageMultiply: 0.04 }, Lan: { ChanceDamage: 0.09, DamageMultiply: 0.04 }, Mar: { DamageMultiply: 0.04 } },
    '2': { Inf: { DamageMultiply: 0.08 }, Lan: { ChanceDamage: 0.18, DamageMultiply: 0.08 }, Mar: { DamageMultiply: 0.08 } },
    '3': { Inf: { DamageMultiply: 0.12 }, Lan: { ChanceDamage: 0.27, DamageMultiply: 0.12 }, Mar: { DamageMultiply: 0.12 } },
    '4': { Inf: { DamageMultiply: 0.16 }, Lan: { ChanceDamage: 0.36, DamageMultiply: 0.16 }, Mar: { DamageMultiply: 0.16 } },
    '5': { Inf: { DamageMultiply: 0.2 }, Lan: { ChanceDamage: 0.45, DamageMultiply: 0.2 }, Mar: { DamageMultiply: 0.2 } },
  },
  "Logan": {
    '1': {  },
    '2': {  },
    '3': {  },
    '4': {  },
    '5': {  },
  },
  "Lynn": {
    '1': { Inf: { DamageMultiply: 0.04 }, Lan: { DamageMultiply: 0.04 }, Mar: { Attack: 0.012, DamageMultiply: 0.04 } },
    '2': { Inf: { DamageMultiply: 0.08 }, Lan: { DamageMultiply: 0.08 }, Mar: { Attack: 0.024, DamageMultiply: 0.08 } },
    '3': { Inf: { DamageMultiply: 0.12 }, Lan: { DamageMultiply: 0.12 }, Mar: { Attack: 0.036, DamageMultiply: 0.12 } },
    '4': { Inf: { DamageMultiply: 0.16 }, Lan: { DamageMultiply: 0.16 }, Mar: { Attack: 0.048, DamageMultiply: 0.16 } },
    '5': { Inf: { DamageMultiply: 0.2 }, Lan: { DamageMultiply: 0.2 }, Mar: { Attack: 0.06, DamageMultiply: 0.2 } },
  },
  "Magnus": {
    '1': { Inf: { Attack: 0.05 }, Lan: { Attack: 0.05 }, Mar: { Attack: 0.05, DamageMultiply: 0.02 } },
    '2': { Inf: { Attack: 0.1 }, Lan: { Attack: 0.1 }, Mar: { Attack: 0.1, DamageMultiply: 0.04 } },
    '3': { Inf: { Attack: 0.15 }, Lan: { Attack: 0.15 }, Mar: { Attack: 0.15, DamageMultiply: 0.06 } },
    '4': { Inf: { Attack: 0.2 }, Lan: { Attack: 0.2 }, Mar: { Attack: 0.2, DamageMultiply: 0.08 } },
    '5': { Inf: { Attack: 0.25 }, Lan: { Attack: 0.25 }, Mar: { Attack: 0.25, DamageMultiply: 0.1 } },
  },
  "Mia": {
    '1': { Inf: { SkillDamageAdds: 0.05, DamageMultiply: 0.07875 }, Lan: { SkillDamageAdds: 0.05, DamageMultiply: 0.07875 }, Mar: { SkillDamageAdds: 0.05, DamageMultiply: 0.07875 } },
    '2': { Inf: { SkillDamageAdds: 0.1, DamageMultiply: 0.1575 }, Lan: { SkillDamageAdds: 0.1, DamageMultiply: 0.1575 }, Mar: { SkillDamageAdds: 0.1, DamageMultiply: 0.1575 } },
    '3': { Inf: { SkillDamageAdds: 0.15, DamageMultiply: 0.23625 }, Lan: { SkillDamageAdds: 0.15, DamageMultiply: 0.23625 }, Mar: { SkillDamageAdds: 0.15, DamageMultiply: 0.23625 } },
    '4': { Inf: { SkillDamageAdds: 0.2, DamageMultiply: 0.315 }, Lan: { SkillDamageAdds: 0.2, DamageMultiply: 0.315 }, Mar: { SkillDamageAdds: 0.2, DamageMultiply: 0.315 } },
    '5': { Inf: { SkillDamageAdds: 0.25, DamageMultiply: 0.39375 }, Lan: { SkillDamageAdds: 0.25, DamageMultiply: 0.39375 }, Mar: { SkillDamageAdds: 0.25, DamageMultiply: 0.39375 } },
  },
  "Molly": {
    '1': { Inf: { Lethality: 0.05, ChanceDamage: 0.05 }, Lan: { Lethality: 0.05, ChanceDamage: 0.05 }, Mar: { Lethality: 0.05, ChanceDamage: 0.05 } },
    '2': { Inf: { Lethality: 0.1, ChanceDamage: 0.1 }, Lan: { Lethality: 0.1, ChanceDamage: 0.1 }, Mar: { Lethality: 0.1, ChanceDamage: 0.1 } },
    '3': { Inf: { Lethality: 0.15, ChanceDamage: 0.15 }, Lan: { Lethality: 0.15, ChanceDamage: 0.15 }, Mar: { Lethality: 0.15, ChanceDamage: 0.15 } },
    '4': { Inf: { Lethality: 0.2, ChanceDamage: 0.2 }, Lan: { Lethality: 0.2, ChanceDamage: 0.2 }, Mar: { Lethality: 0.2, ChanceDamage: 0.2 } },
    '5': { Inf: { Lethality: 0.25, ChanceDamage: 0.25 }, Lan: { Lethality: 0.25, ChanceDamage: 0.25 }, Mar: { Lethality: 0.25, ChanceDamage: 0.25 } },
  },
  "Natalia": {
    '1': { Inf: { Lethality: 0.05, Attack: 0.05 }, Lan: { Lethality: 0.05, Attack: 0.05 }, Mar: { Lethality: 0.05, Attack: 0.05 } },
    '2': { Inf: { Lethality: 0.1, Attack: 0.1 }, Lan: { Lethality: 0.1, Attack: 0.1 }, Mar: { Lethality: 0.1, Attack: 0.1 } },
    '3': { Inf: { Lethality: 0.15, Attack: 0.15 }, Lan: { Lethality: 0.15, Attack: 0.15 }, Mar: { Lethality: 0.15, Attack: 0.15 } },
    '4': { Inf: { Lethality: 0.2, Attack: 0.2 }, Lan: { Lethality: 0.2, Attack: 0.2 }, Mar: { Lethality: 0.2, Attack: 0.2 } },
    '5': { Inf: { Lethality: 0.25, Attack: 0.25 }, Lan: { Lethality: 0.25, Attack: 0.25 }, Mar: { Lethality: 0.25, Attack: 0.25 } },
  },
  "Norah": {
    '1': { Inf: { Lethality: 0.05, DamageMultiply: 0.03 }, Lan: { Lethality: 0.05, SkillDamageAdds: 0.04 }, Mar: { Lethality: 0.05, DamageMultiply: 0.03 } },
    '2': { Inf: { Lethality: 0.1, DamageMultiply: 0.06 }, Lan: { Lethality: 0.1, SkillDamageAdds: 0.08 }, Mar: { Lethality: 0.1, DamageMultiply: 0.06 } },
    '3': { Inf: { Lethality: 0.15, DamageMultiply: 0.09 }, Lan: { Lethality: 0.15, SkillDamageAdds: 0.12 }, Mar: { Lethality: 0.15, DamageMultiply: 0.09 } },
    '4': { Inf: { Lethality: 0.2, DamageMultiply: 0.12 }, Lan: { Lethality: 0.2, SkillDamageAdds: 0.16 }, Mar: { Lethality: 0.2, DamageMultiply: 0.12 } },
    '5': { Inf: { Lethality: 0.25, DamageMultiply: 0.15 }, Lan: { Lethality: 0.25, SkillDamageAdds: 0.2 }, Mar: { Lethality: 0.25, DamageMultiply: 0.15 } },
  },
  "Philly": {
    '1': { Inf: { Attack: 0.03, SkillDamageAdds: 0.05 }, Lan: { Attack: 0.03, SkillDamageAdds: 0.05 }, Mar: { Attack: 0.03, SkillDamageAdds: 0.05 } },
    '2': { Inf: { Attack: 0.06, SkillDamageAdds: 0.1 }, Lan: { Attack: 0.06, SkillDamageAdds: 0.1 }, Mar: { Attack: 0.06, SkillDamageAdds: 0.1 } },
    '3': { Inf: { Attack: 0.09, SkillDamageAdds: 0.15 }, Lan: { Attack: 0.09, SkillDamageAdds: 0.15 }, Mar: { Attack: 0.09, SkillDamageAdds: 0.15 } },
    '4': { Inf: { Attack: 0.12, SkillDamageAdds: 0.2 }, Lan: { Attack: 0.12, SkillDamageAdds: 0.2 }, Mar: { Attack: 0.12, SkillDamageAdds: 0.2 } },
    '5': { Inf: { Attack: 0.15, SkillDamageAdds: 0.25 }, Lan: { Attack: 0.15, SkillDamageAdds: 0.25 }, Mar: { Attack: 0.15, SkillDamageAdds: 0.25 } },
  },
  "Reina": {
    '1': { Inf: { NormalDamage: 0.1 }, Lan: { NormalDamage: 0.1 }, Mar: { NormalDamage: 0.1 } },
    '2': { Inf: { NormalDamage: 0.15 }, Lan: { NormalDamage: 0.15 }, Mar: { NormalDamage: 0.15 } },
    '3': { Inf: { NormalDamage: 0.2 }, Lan: { NormalDamage: 0.2, DamageMultiply: 0.4 }, Mar: { NormalDamage: 0.2 } },
    '4': { Inf: { NormalDamage: 0.25 }, Lan: { NormalDamage: 0.25, DamageMultiply: 0.45 }, Mar: { NormalDamage: 0.25 } },
    '5': { Inf: { NormalDamage: 0.3 }, Lan: { NormalDamage: 0.3, SkillDamageAdds: 0.5 }, Mar: { NormalDamage: 0.3 } },
  },
  "Renee": {
    '1': { Inf: { DamageMultiply: 0.06 }, Lan: { DefenseDown: 0.18 }, Mar: { DamageMultiply: 0.06 } },
    '2': { Inf: { DamageMultiply: 0.12 }, Lan: { DefenseDown: 0.36 }, Mar: { DamageMultiply: 0.12 } },
    '3': { Inf: { DamageMultiply: 0.18 }, Lan: { DefenseDown: 0.54 }, Mar: { DamageMultiply: 0.18 } },
    '4': { Inf: { DamageMultiply: 0.24 }, Lan: { DefenseDown: 0.72 }, Mar: { DamageMultiply: 0.24 } },
    '5': { Inf: { DamageMultiply: 0.3 }, Lan: { DefenseDown: 0.9 }, Mar: { DamageMultiply: 0.3 } },
  },
  "Rufus": {
    '1': { Inf: { Attack: 0.05, DamageTakenUp: 0.045 }, Lan: { Attack: 0.05, DamageTakenUp: 0.045 }, Mar: { Attack: 0.05, DamageTakenUp: 0.045, ChanceDamage: 0.12 } },
    '2': { Inf: { Attack: 0.1, DamageTakenUp: 0.09 }, Lan: { Attack: 0.1, DamageTakenUp: 0.09 }, Mar: { Attack: 0.1, DamageTakenUp: 0.09, ChanceDamage: 0.24 } },
    '3': { Inf: { Attack: 0.15, DamageTakenUp: 0.135 }, Lan: { Attack: 0.15, DamageTakenUp: 0.135 }, Mar: { Attack: 0.15, DamageTakenUp: 0.135, ChanceDamage: 0.36 } },
    '4': { Inf: { Attack: 0.2, DamageTakenUp: 0.18 }, Lan: { Attack: 0.2, DamageTakenUp: 0.18 }, Mar: { Attack: 0.2, DamageTakenUp: 0.18, ChanceDamage: 0.48 } },
    '5': { Inf: { Attack: 0.25, DamageTakenUp: 0.225 }, Lan: { Attack: 0.25, DamageTakenUp: 0.225 }, Mar: { Attack: 0.25, DamageTakenUp: 0.225, ChanceDamage: 0.6 } },
  },
  "Sonya": {
    '1': { Inf: { DamageMultiply: 0.0452 }, Lan: { ChanceDamage: 0.181875, DamageMultiply: 0.04 }, Mar: { DamageMultiply: 0.0452 } },
    '2': { Inf: { DamageMultiply: 0.0908 }, Lan: { ChanceDamage: 0.36375, DamageMultiply: 0.25442 }, Mar: { DamageMultiply: 0.0908 } },
    '3': { Inf: { DamageMultiply: 0.1368 }, Lan: { ChanceDamage: 0.545625, DamageMultiply: 0.39258 }, Mar: { DamageMultiply: 0.1368 } },
    '4': { Inf: { DamageMultiply: 0.1832 }, Lan: { ChanceDamage: 0.7275, DamageMultiply: 0.53816 }, Mar: { DamageMultiply: 0.1832 } },
    '5': { Inf: { DamageMultiply: 0.23 }, Lan: { ChanceDamage: 0.909375, DamageMultiply: 0.2 }, Mar: { DamageMultiply: 0.23 } },
  },
  "Viveca": {
    '1': { Inf: { Attack: 0.05 }, Lan: { Attack: 0.05 }, Mar: { Attack: 0.05, ChanceDamage: 0.04, DamageMultiply: 0.02 } },
    '2': { Inf: { Attack: 0.1 }, Lan: { Attack: 0.1 }, Mar: { Attack: 0.1, ChanceDamage: 0.08, DamageMultiply: 0.04 } },
    '3': { Inf: { Attack: 0.15 }, Lan: { Attack: 0.15 }, Mar: { Attack: 0.15, ChanceDamage: 0.12, DamageMultiply: 0.06 } },
    '4': { Inf: { Attack: 0.2 }, Lan: { Attack: 0.2 }, Mar: { Attack: 0.2, ChanceDamage: 0.16, DamageMultiply: 0.08 } },
    '5': { Inf: { Attack: 0.25 }, Lan: { Attack: 0.25 }, Mar: { Attack: 0.25, ChanceDamage: 0.2, DamageMultiply: 0.1 } },
  },
  "Vulcanus": {
    '1': { Inf: { DamageTakenUp: 0.003, ChanceDamage: 0.04 }, Lan: { DamageTakenUp: 0.003, ChanceDamage: 0.04 }, Mar: { DamageTakenUp: 0.003, ChanceDamage: 0.04 } },
    '2': { Inf: { DamageTakenUp: 0.006, ChanceDamage: 0.08 }, Lan: { DamageTakenUp: 0.006, ChanceDamage: 0.08 }, Mar: { DamageTakenUp: 0.006, ChanceDamage: 0.08 } },
    '3': { Inf: { DamageTakenUp: 0.009, ChanceDamage: 0.12 }, Lan: { DamageTakenUp: 0.009, ChanceDamage: 0.12 }, Mar: { DamageTakenUp: 0.009, ChanceDamage: 0.12 } },
    '4': { Inf: { DamageTakenUp: 0.012, ChanceDamage: 0.16 }, Lan: { DamageTakenUp: 0.012, ChanceDamage: 0.16 }, Mar: { DamageTakenUp: 0.012, ChanceDamage: 0.16 } },
    '5': { Inf: { DamageTakenUp: 0.015, ChanceDamage: 0.2 }, Lan: { DamageTakenUp: 0.015, ChanceDamage: 0.2 }, Mar: { DamageTakenUp: 0.015, ChanceDamage: 0.2 } },
  },
  "Wayne": {
    '1': { Inf: { ChanceDamage: 0.09 }, Lan: { ChanceDamage: 0.09 }, Mar: { ChanceDamage: 0.09 } },
    '2': { Inf: { ChanceDamage: 0.18 }, Lan: { ChanceDamage: 0.18 }, Mar: { ChanceDamage: 0.18 } },
    '3': { Inf: { ChanceDamage: 0.27 }, Lan: { ChanceDamage: 0.27 }, Mar: { ChanceDamage: 0.27 } },
    '4': { Inf: { ChanceDamage: 0.36 }, Lan: { ChanceDamage: 0.36 }, Mar: { ChanceDamage: 0.36 } },
    '5': { Inf: { ChanceDamage: 0.45 }, Lan: { ChanceDamage: 0.45 }, Mar: { ChanceDamage: 0.45 } },
  },
  "Wu Ming": {
    '1': { Inf: { Lethality: 0.04, SkillDamageWuMing: 0.05 }, Lan: { Lethality: 0.04, SkillDamageWuMing: 0.05 }, Mar: { Lethality: 0.04, SkillDamageWuMing: 0.05 } },
    '2': { Inf: { Lethality: 0.08, SkillDamageWuMing: 0.1 }, Lan: { Lethality: 0.08, SkillDamageWuMing: 0.1 }, Mar: { Lethality: 0.08, SkillDamageWuMing: 0.1 } },
    '3': { Inf: { Lethality: 0.12, SkillDamageWuMing: 0.15 }, Lan: { Lethality: 0.12, SkillDamageWuMing: 0.15 }, Mar: { Lethality: 0.12, SkillDamageWuMing: 0.15 } },
    '4': { Inf: { Lethality: 0.16, SkillDamageWuMing: 0.2 }, Lan: { Lethality: 0.16, SkillDamageWuMing: 0.2 }, Mar: { Lethality: 0.16, SkillDamageWuMing: 0.2 } },
    '5': { Inf: { Lethality: 0.2, SkillDamageWuMing: 0.25 }, Lan: { Lethality: 0.2, SkillDamageWuMing: 0.25 }, Mar: { Lethality: 0.2, SkillDamageWuMing: 0.25 } },
  },
  "Xura": {
    '1': { Inf: { DamageMultiply: 0.005 }, Lan: { DamageMultiply: 0.005 }, Mar: { Lethality: 0.03, DamageMultiply: 0.1075 } },
    '2': { Inf: { DamageMultiply: 0.01 }, Lan: { DamageMultiply: 0.01 }, Mar: { Lethality: 0.06, DamageMultiply: 0.212 } },
    '3': { Inf: { DamageMultiply: 0.015 }, Lan: { DamageMultiply: 0.015 }, Mar: { Lethality: 0.09, DamageMultiply: 0.3195 } },
    '4': { Inf: { DamageMultiply: 0.02 }, Lan: { DamageMultiply: 0.02 }, Mar: { Lethality: 0.12, DamageMultiply: 0.428 } },
    '5': { Inf: { DamageMultiply: 0.025 }, Lan: { DamageMultiply: 0.025 }, Mar: { Lethality: 0.15, DamageMultiply: 0.5375 } },
  },
  "Zinman": {
    '1': { Inf: { Lethality: 0.05 }, Lan: { Lethality: 0.05 }, Mar: { Lethality: 0.05 } },
    '2': { Inf: { Lethality: 0.1 }, Lan: { Lethality: 0.1 }, Mar: { Lethality: 0.1 } },
    '3': { Inf: { Lethality: 0.15 }, Lan: { Lethality: 0.15 }, Mar: { Lethality: 0.15 } },
    '4': { Inf: { Lethality: 0.2 }, Lan: { Lethality: 0.2 }, Mar: { Lethality: 0.2 } },
    '5': { Inf: { Lethality: 0.25 }, Lan: { Lethality: 0.25 }, Mar: { Lethality: 0.25 } },
  },
};
