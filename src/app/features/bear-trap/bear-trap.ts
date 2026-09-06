import { Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BEAR_TRAP_HEROES } from '../../core/data/heroes';
import { TROOP_TIER_TABLE } from '../../core/data/troop-tier-table';
import { BearTrapInputs, HeroClass, LineupResult, defaultBearTrapInputs } from '../../core/models/bear-trap.model';
import { CalculatorService } from '../../core/services/calculator.service';
import { SaveCodeService } from '../../core/services/save-code.service';
import { HelpDialog, HelpDialogData } from '../../shared/help-dialog/help-dialog';

/** Content for the two (i) help popups — see openHelp(). Each step can carry
 *  a screenshot shown right under it, so the picture sits next to the exact
 *  instruction it illustrates rather than all being dumped at the end. */
const HELP_CONTENT: Record<'power' | 'gear', HelpDialogData> = {
  power: {
    title: 'Where do I find these numbers?',
    steps: [
      {
        text: 'Tap your power number (top of the main screen) to open Bonus Overview.',
        image: { src: 'help/power-number-location.jpg', alt: 'Main screen top bar with the power number highlighted', caption: 'Tap this number' },
      },
      {
        text: 'Open (or scroll to) the Military section — it lists \'Troops\' Attack/Defense/Lethality/Health\' (that\'s the \'All troops\' row in this app) followed by the same four stats for each troop type (Infantry, Lancer, Marksman further down).',
        image: { src: 'help/power-bonus-overview.jpg', alt: 'Bonus Overview screen, Military section, with Troops’ Attack, Troops’ Lethality, and Infantry Attack highlighted', caption: 'Bonus Overview → Military' },
      },
      {
        text: 'Enter each percentage here exactly as shown, decimals included — e.g. a bonus shown as 482.39% is entered as 482.39. The app does the rest of the math.',
      },
    ],
  },
  gear: {
    title: 'How do I read equipped vs. unequipped gear stats?',
    steps: [
      { text: 'Open your heroes and select one.' },
      { text: 'Fully unequip that hero (no gear).' },
      { text: 'Tap the list icon at the bottom right to open Hero Overall Stats, then look at the Expedition section — it shows his current Attack/Defense/Lethality/Health.' },
      {
        text: 'Note the Attack and Lethality under \'Unequipped\', exactly as shown.',
        image: { src: 'help/gear-unequipped.jpg', alt: 'Hero Overall Stats popup, Expedition section, with the troop gear set unequipped, Infantry Attack and Lethality highlighted', caption: 'Unequipped' },
      },
      {
        text: 'Equip your best gear for that troop type, reopen the same popup, and note Attack and Lethality again — enter those under \'Equipped\'.',
        image: { src: 'help/gear-equipped.jpg', alt: 'Hero Overall Stats popup, Expedition section, with the troop gear set equipped, Infantry Attack and Lethality highlighted', caption: 'Equipped' },
      },
      { text: 'Repeat for each troop type. Defense and Health shown here aren\'t used by this calculator — just Attack and Lethality.' },
    ],
  },
};

const PET_LEVEL_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

/** Whiteout Survival governor IDs are numeric; mirrors save-code.service.ts's own check. */
const PLAYER_ID_PATTERN = /^\d{5,12}$/;

/** Every generation present in the roster, ascending, for the "latest generation" picker. */
const GENERATIONS = [...new Set(BEAR_TRAP_HEROES.map(h => h.gen))].sort((a, b) => a - b);
const LATEST_GENERATION = GENERATIONS[GENERATIONS.length - 1];

interface HeroRow {
  name: string;
  class: HeroClass;
  gen: number;
  stars: number;
  widget: number;
}

interface GenerationGroup {
  gen: number;
  heroes: HeroRow[];
}

type TroopTypeKey = 'inf' | 'lanc' | 'mark';
type BaseStatScopeKey = 'allTroops' | TroopTypeKey;

const TROOP_TYPE_SCOPES: { key: TroopTypeKey; label: string }[] = [
  { key: 'inf', label: 'Infantry' },
  { key: 'lanc', label: 'Lancer' },
  { key: 'mark', label: 'Marksman' },
];
const BASE_STAT_SCOPES: { key: BaseStatScopeKey; label: string }[] = [
  { key: 'allTroops', label: 'All troops' },
  ...TROOP_TYPE_SCOPES,
];

@Component({
  selector: 'app-bear-trap',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './bear-trap.html',
  styleUrl: './bear-trap.scss',
})
export class BearTrap {
  readonly petLevelOptions = PET_LEVEL_OPTIONS;
  readonly generations = GENERATIONS;
  // Only T10/T11 are worth offering — nobody runs Bear Trap troops below that.
  readonly troopTierKeys = TROOP_TIER_TABLE.map(r => r.key).filter(k => k.endsWith(' T10') || k.endsWith(' T11'));
  readonly troopTypeScopes = TROOP_TYPE_SCOPES;
  readonly baseStatScopes = BASE_STAT_SCOPES;
  readonly gearReadingKeys: ('equipped' | 'unequipped')[] = ['unequipped', 'equipped'];

  readonly inputs = signal<BearTrapInputs>(defaultBearTrapInputs(BEAR_TRAP_HEROES.map(h => h.name), LATEST_GENERATION));
  readonly results = signal<LineupResult[]>([]);
  /** Shared by Save and Load — the player's own governor ID doubles as their save slot. */
  readonly playerIdText = signal('');

  readonly heroesByGeneration = computed<GenerationGroup[]>(() => {
    const maxGen = this.inputs().latestGeneration;
    const levels = this.inputs().heroLevels;
    const byName = new Map(levels.map(h => [h.name, h]));
    const groups = new Map<number, HeroRow[]>();
    for (const hero of BEAR_TRAP_HEROES) {
      if (hero.gen > maxGen) continue;
      const level = byName.get(hero.name);
      const row: HeroRow = { name: hero.name, class: hero.class, gen: hero.gen, stars: level?.stars ?? 0, widget: level?.widget ?? 0 };
      const group = groups.get(hero.gen);
      if (group) group.push(row);
      else groups.set(hero.gen, [row]);
    }
    return [...groups.entries()]
      .sort(([a], [b]) => b - a)
      .map(([gen, heroes]) => ({ gen, heroes: heroes.sort((a, b) => a.name.localeCompare(b.name)) }));
  });

  readonly effectiveSquadSize = computed(() => this.calculator.effectiveSquadSize(this.inputs()));

  constructor(
    private readonly calculator: CalculatorService,
    private readonly saveCode: SaveCodeService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {}

  openHelp(kind: 'power' | 'gear'): void {
    this.dialog.open(HelpDialog, { data: HELP_CONTENT[kind], autoFocus: false });
  }

  updateLatestGeneration(gen: number): void {
    this.inputs.update(inputs => ({ ...inputs, latestGeneration: gen }));
  }

  updateHeroLevel(name: string, field: 'stars' | 'widget', value: number): void {
    this.inputs.update(inputs => ({
      ...inputs,
      heroLevels: inputs.heroLevels.map(h => h.name === name ? { ...h, [field]: value } : h),
    }));
  }

  updateSquadSize(value: number): void {
    this.inputs.update(inputs => ({ ...inputs, squadSize: value }));
  }

  updateBaseStat(scope: 'allTroops' | 'inf' | 'lanc' | 'mark', field: 'lethality' | 'attack', value: number): void {
    this.inputs.update(inputs => ({
      ...inputs,
      baseStats: { ...inputs.baseStats, [scope]: { ...inputs.baseStats[scope], [field]: value } },
    }));
  }

  updateGear(type: 'inf' | 'lanc' | 'mark', which: 'equipped' | 'unequipped', field: 'lethality' | 'attack', value: number): void {
    this.inputs.update(inputs => ({
      ...inputs,
      gear: {
        ...inputs.gear,
        [type]: { ...inputs.gear[type], [which]: { ...inputs.gear[type][which], [field]: value } },
      },
    }));
  }

  baseStatValue(scope: 'allTroops' | 'inf' | 'lanc' | 'mark', field: 'lethality' | 'attack'): number {
    return this.inputs().baseStats[scope][field];
  }

  gearValue(type: 'inf' | 'lanc' | 'mark', which: 'equipped' | 'unequipped', field: 'lethality' | 'attack'): number {
    return this.inputs().gear[type][which][field];
  }

  tierValue(type: 'inf' | 'lanc' | 'mark'): string {
    return this.inputs().troopTiers[type];
  }

  updateTroopTier(type: 'inf' | 'lanc' | 'mark', key: string): void {
    this.inputs.update(inputs => ({ ...inputs, troopTiers: { ...inputs.troopTiers, [type]: key } }));
  }

  updatePet(field: keyof BearTrapInputs['pets'], value: boolean | number): void {
    this.inputs.update(inputs => ({ ...inputs, pets: { ...inputs.pets, [field]: value } }));
  }

  calculate(): void {
    this.results.set(this.calculator.findBestLineups(this.inputs(), 15));
  }

  async saveSetup(): Promise<void> {
    const id = this.playerIdText().trim();
    if (!PLAYER_ID_PATTERN.test(id)) {
      this.snackBar.open('Enter your player ID (numbers only) first.', 'Dismiss', { duration: 6000 });
      return;
    }
    try {
      await this.saveCode.save(this.inputs(), id);
      this.snackBar.open(`Saved to ID ${id} — saving again will overwrite this.`, 'Dismiss', { duration: 6000 });
    } catch (err) {
      this.snackBar.open('Save failed — please try again.', 'Dismiss', { duration: 6000 });
      console.error(err);
    }
  }

  async loadSetup(): Promise<void> {
    const id = this.playerIdText().trim();
    if (!PLAYER_ID_PATTERN.test(id)) {
      this.snackBar.open('Enter your player ID (numbers only) first.', 'Dismiss', { duration: 6000 });
      return;
    }
    const loaded = await this.saveCode.load(id);
    if (!loaded) {
      this.snackBar.open('No saved setup found for that ID.', 'Dismiss', { duration: 6000 });
      return;
    }
    // Older saves predate latestGeneration — fall back so they don't hide every hero.
    this.inputs.set({ ...loaded, latestGeneration: loaded.latestGeneration ?? LATEST_GENERATION });
    this.results.set([]);
    this.snackBar.open('Setup loaded.', 'Dismiss', { duration: 4000 });
  }

  formatRatio(result: LineupResult): string {
    const pct = (n: number) => Math.round(n * 100);
    return `${pct(result.ratio.inf)} / ${pct(result.ratio.lanc)} / ${pct(result.ratio.mark)}`;
  }
}
