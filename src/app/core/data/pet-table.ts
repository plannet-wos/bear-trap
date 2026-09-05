// Pet bonus by pet level (1-10). Cave Lion and Sabre-tooth Tiger grant a
// multiplicative Lethality bonus (applied to every hero's personal stat, see
// calculator.service.ts); Snow Ape grants a flat squad-size increase.
// Source: General lookup tables!F10:I20.
export interface PetLevelRow {
  level: number;
  caveLion: number;   // Lethality bonus fraction
  snowApe: number;    // flat troop-capacity bonus
  sabreTooth: number; // Lethality bonus fraction
}

export const PET_TABLE: PetLevelRow[] = [
  { level: 1, caveLion: 0.025, snowApe: 1500, sabreTooth: 0.025 },
  { level: 2, caveLion: 0.03, snowApe: 3000, sabreTooth: 0.03 },
  { level: 3, caveLion: 0.035, snowApe: 4500, sabreTooth: 0.035 },
  { level: 4, caveLion: 0.04, snowApe: 6000, sabreTooth: 0.04 },
  { level: 5, caveLion: 0.05, snowApe: 7500, sabreTooth: 0.05 },
  { level: 6, caveLion: 0.06, snowApe: 9000, sabreTooth: 0.06 },
  { level: 7, caveLion: 0.07, snowApe: 10500, sabreTooth: 0.07 },
  { level: 8, caveLion: 0.08, snowApe: 12000, sabreTooth: 0.08 },
  { level: 9, caveLion: 0.09, snowApe: 13500, sabreTooth: 0.09 },
  { level: 10, caveLion: 0.1, snowApe: 15000, sabreTooth: 0.1 },
];
