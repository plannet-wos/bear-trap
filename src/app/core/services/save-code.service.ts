import { Injectable } from '@angular/core';
import {
  doc,
  getDoc,
  getFirestore,
  runTransaction,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';

import { BearTrapInputs } from '../models/bear-trap.model';

/** One save-slot stored in Firestore at /bear_trap_saves/{code}. */
export interface SaveCodePayload {
  /** Schema version — bump when the shape changes incompatibly. */
  v: number;
  inputs: BearTrapInputs;
}

export interface SaveCodeResult {
  code: string;
}

/**
 * Alphabet used for save codes. Excludes visually-confusable chars (0/O,
 * 1/I/L) so a code can be read off a screen and typed without mistakes.
 * Same alphabet as battle-calculator's save-code service.
 */
const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const CODE_LENGTH = 4;
const MAX_RETRIES = 8;
const COLLECTION = 'bear_trap_saves';

@Injectable({ providedIn: 'root' })
export class SaveCodeService {
  private _db: Firestore | null = null;

  private get db(): Firestore {
    // Lazy so initializeApp(...) in app.config.ts has definitely run.
    if (!this._db) this._db = getFirestore();
    return this._db;
  }

  /**
   * Generates a fresh code, writes the payload via a transaction (so we can
   * atomically refuse to overwrite an existing code), and retries on the rare
   * collision. Throws if MAX_RETRIES collide in a row.
   */
  async save(inputs: BearTrapInputs): Promise<SaveCodeResult> {
    const data: SaveCodePayload = { v: 1, inputs };

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const code = randomCode();
      const ref = doc(this.db, COLLECTION, code);
      const winner = await runTransaction(this.db, async tx => {
        const snap = await tx.get(ref);
        if (snap.exists()) return null; // collision — retry
        tx.set(ref, { ...data, createdAt: serverTimestamp() });
        return code;
      });
      if (winner) return { code: winner };
    }
    throw new Error('Save-code generation failed: too many collisions');
  }

  /**
   * Reads a save by code. Returns null if the code does not exist, or if the
   * stored payload is from a future incompatible version.
   */
  async load(code: string): Promise<BearTrapInputs | null> {
    const normalized = normalizeCode(code);
    if (!normalized) return null;
    const ref = doc(this.db, COLLECTION, normalized);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const raw = snap.data() as Partial<SaveCodePayload>;
    if (raw.v !== 1 || !raw.inputs) return null;
    return raw.inputs;
  }
}

/** Random 4-char code drawn from the Crockford-ish alphabet. */
function randomCode(): string {
  let out = '';
  const buf = new Uint32Array(CODE_LENGTH);
  crypto.getRandomValues(buf);
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[buf[i] % CODE_ALPHABET.length];
  }
  return out;
}

/**
 * Cleans user-typed input — uppercases, drops whitespace, validates length and
 * alphabet. Returns null if the input can't be a real code.
 */
function normalizeCode(raw: string): string | null {
  if (!raw) return null;
  const cleaned = raw.toUpperCase().replace(/\s+/g, '');
  if (cleaned.length !== CODE_LENGTH) return null;
  for (const ch of cleaned) {
    if (!CODE_ALPHABET.includes(ch)) return null;
  }
  return cleaned;
}
