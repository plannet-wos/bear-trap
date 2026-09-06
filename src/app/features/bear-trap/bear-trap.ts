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

/** Content for the two (i) help popups — see openHelp(). Screenshots go in
 *  public/help/ and get an `images` entry here once available; until then the
 *  dialog just shows "Screenshots coming soon." */
const HELP_CONTENT: Record<'power' | 'gear', HelpDialogData> = {
  power: {
    title: 'Where do I find these numbers?',
    steps: [
      'Tap your power number (top of the main screen) to open Bonus Overview.',
      'Open (or scroll to) the Military section — it lists \'Troops\' Attack/Defense/Lethality/Health\' (that\'s the \'All troops\' row in this app) followed by the same four stats for each troop type (Infantry, Lancer, Marksman further down).',
      'Enter each percentage here exactly as shown, decimals included — e.g. a bonus shown as 482.39% is entered as 482.39. The app does the rest of the math.',
    ],
    images: [
      { src: 'help/power-number-location.jpg', alt: 'Main screen top bar with the power number highlighted', caption: 'Tap this number' },
      { src: 'help/power-bonus-overview.jpg', alt: 'Bonus Overview screen, Military section, with Troops’ Attack, Troops’ Lethality, and Infantry Attack highlighted', caption: 'Bonus Overview → Military' },
    ],
  },
  gear: {
    title: 'How do I read equipped vs. unequipped gear stats?',
    steps: [
      'Open any hero\'s Stats tab and tap the list icon to open Hero Overall Stats, then look at the Expedition section — it shows your account\'s current Attack/Defense/Lethality/Health for each troop type (this is the same for every hero, not specific to whoever you opened).',
      'With a troop type\'s gear set unequipped, note that type\'s Attack and Lethality — enter those under \'Unequipped\', exactly as shown.',
      'Equip the full 4-piece set for that troop type, reopen the same popup, and note Attack and Lethality again — enter those under \'Equipped\'.',
      'Repeat for each troop type. Defense and Health shown here aren\'t used by this calculator — just Attack and Lethality. The app subtracts unequipped from equipped, and converts to the math it needs, for you.',
    ],
    images: [
      { src: 'help/gear-unequipped.jpg', alt: 'Hero Overall Stats popup, Expedition section, with the troop gear set unequipped, Infantry Attack and Lethality highlighted', caption: 'Unequipped' },
      { src: 'help/gear-equipped.jpg', alt: 'Hero Overall Stats popup, Expedition section, with the troop gear set equipped, Infantry Attack and Lethality highlighted', caption: 'Equipped' },
    ],
  },
};

const PET_LEVEL_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

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
  readonly gearReadingKeys: ('equipped' | 'unequipped')[] = ['equipped', 'unequipped'];

  readonly inputs = signal<BearTrapInputs>(defaultBearTrapInputs(BEAR_TRAP_HEROES.map(h => h.name)));
  readonly results = signal<LineupResult[]>([]);
  readonly loadCodeText = signal('');
  readonly lastSavedCode = signal<string | null>(null);

  /** "I have up to this generation" — heroes past it are hidden from the roster
   *  entirely (not just collapsed), since a player can't own them yet. */
  readonly latestGeneration = signal<number>(LATEST_GENERATION);

  readonly heroesByGeneration = computed<GenerationGroup[]>(() => {
    const maxGen = this.latestGeneration();
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
    this.latestGeneration.set(gen);
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
    try {
      const { code } = await this.saveCode.save(this.inputs());
      this.lastSavedCode.set(code);
      this.snackBar.open(`Saved — code ${code}`, 'Dismiss', { duration: 6000 });
    } catch (err) {
      this.snackBar.open('Save failed — please try again.', 'Dismiss', { duration: 6000 });
      console.error(err);
    }
  }

  async loadSetup(): Promise<void> {
    const code = this.loadCodeText();
    const loaded = await this.saveCode.load(code);
    if (!loaded) {
      this.snackBar.open('Code not found.', 'Dismiss', { duration: 6000 });
      return;
    }
    this.inputs.set(loaded);
    this.results.set([]);
    this.snackBar.open('Setup loaded.', 'Dismiss', { duration: 4000 });
  }

  formatRatio(result: LineupResult): string {
    const pct = (n: number) => Math.round(n * 100);
    return `${pct(result.ratio.inf)} / ${pct(result.ratio.lanc)} / ${pct(result.ratio.mark)}`;
  }
}
