import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';

// Initialize Firebase once at module load. Subsequent imports of `firebase/app`
// or `firebase/firestore` reuse this default app. Save-code service in
// `core/services/save-code.service.ts` calls `getFirestore()` which picks up
// this default app.
initializeApp(environment.firebase);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // This app has no zone.js (no dependency, no polyfill import) but also
    // never called this — meaning it ran in neither a real zone-based nor a
    // properly-scheduled zoneless mode. CLAUDE.md already mandated zoneless;
    // this just makes it actually true.
    provideZonelessChangeDetection(),
    // CDK 21 renders overlays (mat-select's panel, mat-dialog, etc.) using the
    // browser's native Popover API by default, with an automatic fallback to
    // the classic JS-managed overlay container on browsers that don't support
    // it. That fallback covers "unsupported" cleanly, but says nothing about
    // browsers that DO support the Popover API yet handle its light-dismiss/
    // stacking semantics differently (Safari and Android WebView especially —
    // this is a brand-new code path as of this CDK version). A "some selects
    // are fully broken" report on unknown player devices, with no failure
    // reproducible here across dozens of automated runs in Chromium, is
    // exactly the shape of a native-API cross-browser quirk rather than a
    // logic bug — so opt back into the long-established overlay-container
    // behavior instead of the newer native path.
    { provide: OVERLAY_DEFAULT_CONFIG, useValue: { usePopover: false } },
  ]
};
