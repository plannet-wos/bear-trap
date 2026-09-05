import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface HelpImage {
  src: string;
  caption?: string;
  alt: string;
}

export interface HelpDialogData {
  title: string;
  /** Short numbered walkthrough — each entry is one step. */
  steps: string[];
  /** Screenshots illustrating the steps above, shown below them in order. */
  images?: HelpImage[];
}

/** Small "how do I find this?" popup, opened from an (i) icon next to an input
 *  section. Content is passed in per-caller via MAT_DIALOG_DATA — see
 *  bear-trap.ts's openHelp(). */
@Component({
  selector: 'app-help-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <ol>
        @for (step of data.steps; track step) {
          <li>{{ step }}</li>
        }
      </ol>
      @for (image of data.images; track image.src) {
        <figure class="help-figure">
          <img [src]="image.src" [alt]="image.alt" />
          @if (image.caption) {
            <figcaption>{{ image.caption }}</figcaption>
          }
        </figure>
      } @empty {
        @if (data.images !== undefined) {
          <p class="help-placeholder">Screenshots coming soon.</p>
        }
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display: block; max-width: 480px; }
    ol { margin: 0; padding-left: 20px; }
    li { margin-bottom: 8px; }
    .help-figure { margin: 16px 0 0; }
    .help-figure img { max-width: 100%; border-radius: 8px; display: block; }
    .help-figure figcaption { font-size: 0.8rem; color: var(--mat-sys-on-surface-variant); margin-top: 4px; }
    .help-placeholder { color: var(--mat-sys-on-surface-variant); font-style: italic; }
  `],
})
export class HelpDialog {
  constructor(
    public dialogRef: MatDialogRef<HelpDialog>,
    @Inject(MAT_DIALOG_DATA) public data: HelpDialogData,
  ) {}
}
