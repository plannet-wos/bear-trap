import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface HelpImage {
  src: string;
  caption?: string;
  alt: string;
}

export interface HelpStep {
  text: string;
  /** Screenshot shown directly under this step, when it illustrates it best —
   *  e.g. "tap your power number" gets the screenshot of where that is, right
   *  there, rather than every image being dumped at the end out of context. */
  image?: HelpImage;
}

export interface HelpDialogData {
  title: string;
  steps: HelpStep[];
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
        @for (step of data.steps; track step.text) {
          <li>
            {{ step.text }}
            @if (step.image; as image) {
              <figure class="help-figure">
                <img [src]="image.src" [alt]="image.alt" />
                @if (image.caption) {
                  <figcaption>{{ image.caption }}</figcaption>
                }
              </figure>
            }
          </li>
        }
      </ol>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display: block; max-width: 480px; }
    ol { margin: 0; padding-left: 20px; }
    li { margin-bottom: 12px; }
    .help-figure { margin: 8px 0 0; }
    .help-figure img { max-width: 100%; border-radius: 8px; display: block; }
    .help-figure figcaption { font-size: 0.8rem; color: var(--mat-sys-on-surface-variant); margin-top: 4px; }
  `],
})
export class HelpDialog {
  constructor(
    public dialogRef: MatDialogRef<HelpDialog>,
    @Inject(MAT_DIALOG_DATA) public data: HelpDialogData,
  ) {}
}
