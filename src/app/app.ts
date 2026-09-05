import { Component } from '@angular/core';
import { BearTrap } from './features/bear-trap/bear-trap';
import { AppSwitcherComponent } from './shared/app-switcher/app-switcher';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BearTrap, AppSwitcherComponent],
  template: `<app-bear-trap /><app-switcher />`,
  styles: [],
})
export class App {}
