// Extracted from Rainbow Valley's WoS bear-hunt calculator spreadsheet
// (General lookup tables!D31:H95). gen matches the generation keys used by
// GEN_LETHALITY_COEFF; rallyLeth/rallyAtk are 0/1 flags for whether this hero's
// exclusive skill also grants the flat 'rally leader' bonus (see calculator.service.ts).
import { HeroClass } from '../models/bear-trap.model';

export interface BearTrapHero {
  name: string;
  class: HeroClass;
  gen: number;
  rallyLeth: 0 | 1;
  rallyAtk: 0 | 1;
}

export const BEAR_TRAP_HEROES: BearTrapHero[] = [
  { name: "Ahmose", class: "Infantry", gen: 4, rallyLeth: 0, rallyAtk: 0 },
  { name: "Alonso", class: "Marksman", gen: 2, rallyLeth: 1, rallyAtk: 0 },
  { name: "Blanchette", class: "Marksman", gen: 10, rallyLeth: 1, rallyAtk: 0 },
  { name: "Bradley", class: "Marksman", gen: 7, rallyLeth: 0, rallyAtk: 0 },
  { name: "Cara", class: "Marksman", gen: 14, rallyLeth: 0, rallyAtk: 0 },
  { name: "Dominic", class: "Lancer", gen: 14, rallyLeth: 1, rallyAtk: 0 },
  { name: "Edith", class: "Infantry", gen: 7, rallyLeth: 0, rallyAtk: 0 },
  { name: "Eleonora", class: "Infantry", gen: 11, rallyLeth: 0, rallyAtk: 0 },
  { name: "Elif", class: "Infantry", gen: 14, rallyLeth: 0, rallyAtk: 0 },
  { name: "Estrella", class: "Lancer", gen: 15, rallyLeth: 0, rallyAtk: 0 },
  { name: "Flint", class: "Infantry", gen: 2, rallyLeth: 0, rallyAtk: 0 },
  { name: "Flora", class: "Lancer", gen: 13, rallyLeth: 0, rallyAtk: 0 },
  { name: "Fred", class: "Lancer", gen: 9, rallyLeth: 0, rallyAtk: 1 },
  { name: "Freya", class: "Lancer", gen: 10, rallyLeth: 0, rallyAtk: 0 },
  { name: "Gatot", class: "Infantry", gen: 8, rallyLeth: 0, rallyAtk: 0 },
  { name: "Gisela", class: "Infantry", gen: 13, rallyLeth: 0, rallyAtk: 0 },
  { name: "Gordon", class: "Lancer", gen: 7, rallyLeth: 1, rallyAtk: 0 },
  { name: "Greg", class: "Marksman", gen: 3, rallyLeth: 0, rallyAtk: 0 },
  { name: "Gregory", class: "Infantry", gen: 10, rallyLeth: 0, rallyAtk: 0 },
  { name: "Gwen", class: "Marksman", gen: 5, rallyLeth: 1, rallyAtk: 0 },
  { name: "Hank", class: "Infantry", gen: 15, rallyLeth: 0, rallyAtk: 0 },
  { name: "Hector", class: "Infantry", gen: 5, rallyLeth: 0, rallyAtk: 0 },
  { name: "Hendrik", class: "Marksman", gen: 8, rallyLeth: 0, rallyAtk: 1 },
  { name: "Hervor", class: "Infantry", gen: 12, rallyLeth: 0, rallyAtk: 0 },
  { name: "Jeronimo", class: "Infantry", gen: 1.2, rallyLeth: 0, rallyAtk: 1 },
  { name: "Karol", class: "Lancer", gen: 12, rallyLeth: 0, rallyAtk: 1 },
  { name: "Ligeia", class: "Marksman", gen: 12, rallyLeth: 0, rallyAtk: 0 },
  { name: "Lloyd", class: "Lancer", gen: 11, rallyLeth: 0, rallyAtk: 0 },
  { name: "Logan", class: "Infantry", gen: 3, rallyLeth: 0, rallyAtk: 0 },
  { name: "Lynn", class: "Marksman", gen: 4, rallyLeth: 0, rallyAtk: 0 },
  { name: "Magnus", class: "Infantry", gen: 9, rallyLeth: 0, rallyAtk: 0 },
  { name: "Mia", class: "Lancer", gen: 3, rallyLeth: 0, rallyAtk: 1 },
  { name: "Molly", class: "Lancer", gen: 1, rallyLeth: 0, rallyAtk: 0 },
  { name: "Natalia", class: "Infantry", gen: 1.1, rallyLeth: 1, rallyAtk: 0 },
  { name: "Norah", class: "Lancer", gen: 5, rallyLeth: 0, rallyAtk: 0 },
  { name: "Philly", class: "Lancer", gen: 2, rallyLeth: 0, rallyAtk: 0 },
  { name: "Reina", class: "Lancer", gen: 4, rallyLeth: 1, rallyAtk: 0 },
  { name: "Renee", class: "Lancer", gen: 6, rallyLeth: 1, rallyAtk: 0 },
  { name: "Rufus", class: "Marksman", gen: 11, rallyLeth: 0, rallyAtk: 1 },
  { name: "Sonya", class: "Lancer", gen: 8, rallyLeth: 0, rallyAtk: 0 },
  { name: "Viveca", class: "Marksman", gen: 15, rallyLeth: 0, rallyAtk: 0 },
  { name: "Vulcanus", class: "Marksman", gen: 13, rallyLeth: 0, rallyAtk: 1 },
  { name: "Wayne", class: "Marksman", gen: 6, rallyLeth: 0, rallyAtk: 0 },
  { name: "Wu Ming", class: "Infantry", gen: 6, rallyLeth: 0, rallyAtk: 0 },
  { name: "Xura", class: "Marksman", gen: 9, rallyLeth: 0, rallyAtk: 0 },
  { name: "Zinman", class: "Marksman", gen: 1, rallyLeth: 0, rallyAtk: 0 },
];
