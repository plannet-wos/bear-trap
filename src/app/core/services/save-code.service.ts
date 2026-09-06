import { Injectable } from '@angular/core';
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  Firestore,
} from 'firebase/firestore';

import { BearTrapInputs } from '../models/bear-trap.model';

/** One save-slot stored in Firestore at /bear_trap_saves/{playerId}. */
export interface SaveCodePayload {
  /** Schema version — bump when the shape changes incompatibly. */
  v: number;
  inputs: BearTrapInputs;
}

const COLLECTION = 'bear_trap_saves';

/** Whiteout Survival governor IDs are numeric; 5-12 digits covers every ID
 *  seen in the wild with room to grow. Matches firestore.rules' own check —
 *  see isValidBearTrapPlayerId() in plannet-wos. */
export const PLAYER_ID_PATTERN = /^\d{5,12}$/;

/** The generated share codes this app used before switching to player-ID
 *  saves — no longer written, but Firestore still holds (and firestore.rules
 *  still allows reading) whatever codes were already handed out, so Load
 *  keeps accepting this shape too. */
const LEGACY_CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const LEGACY_CODE_LENGTH = 4;

/**
 * Save/load keyed by the player's own governor ID rather than a generated
 * share code — saving again just overwrites that player's existing slot, so
 * there's nothing to remember beyond the ID they already have. Load also
 * still accepts an old-style 4-char code, for saves made before this switch.
 */
@Injectable({ providedIn: 'root' })
export class SaveCodeService {
  private _db: Firestore | null = null;

  private get db(): Firestore {
    // Lazy so initializeApp(...) in app.config.ts has definitely run.
    if (!this._db) this._db = getFirestore();
    return this._db;
  }

  /** Writes (or overwrites) this player's save slot. Throws if `playerId` isn't shaped like a real governor ID. */
  async save(inputs: BearTrapInputs, playerId: string): Promise<void> {
    const id = normalizePlayerId(playerId);
    if (!id) throw new Error('Enter a valid player ID (numbers only).');
    const ref = doc(this.db, COLLECTION, id);
    const data: SaveCodePayload = { v: 1, inputs };
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }

  /** Reads a save by player ID (or a legacy share code). Returns null if there's no save under that key, it's malformed, or from a future incompatible version. */
  async load(key: string): Promise<BearTrapInputs | null> {
    const id = normalizePlayerId(key) ?? normalizeLegacyCode(key);
    if (!id) return null;
    const ref = doc(this.db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const raw = snap.data() as Partial<SaveCodePayload>;
    if (raw.v !== 1 || !raw.inputs) return null;
    return raw.inputs;
  }
}

/** Trims whitespace and validates the ID looks like a real governor ID. Returns null if it doesn't. */
function normalizePlayerId(raw: string): string | null {
  if (!raw) return null;
  const cleaned = raw.trim();
  return PLAYER_ID_PATTERN.test(cleaned) ? cleaned : null;
}

/** Uppercases and validates a legacy 4-char share code. Returns null if it doesn't look like one. */
function normalizeLegacyCode(raw: string): string | null {
  if (!raw) return null;
  const cleaned = raw.toUpperCase().replace(/\s+/g, '');
  if (cleaned.length !== LEGACY_CODE_LENGTH) return null;
  for (const ch of cleaned) {
    if (!LEGACY_CODE_ALPHABET.includes(ch)) return null;
  }
  return cleaned;
}
