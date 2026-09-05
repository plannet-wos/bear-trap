// Per-widget-level Lethality % bonus coefficient, keyed by hero generation.
// Personal Lethality contribution = widgetLevel * GEN_LETHALITY_COEFF[hero.gen].
// Source: General lookup tables!A3:B19.
export const GEN_LETHALITY_COEFF: Record<string, number> = {
  '1': 0.05,
  '1.1': 0.0555,
  '1.2': 0.0625,
  '2': 0.06,
  '3': 0.07,
  '4': 0.0925,
  '5': 0.111,
  '6': 0.1335,
  '7': 0.1605,
  '8': 0.193,
  '9': 0.232,
  '10': 0.2775,
  '11': 0.32,
  '12': 0.3625,
  '13': 0.405,
  '14': 0.4475,
  '15': 0.5,
};
