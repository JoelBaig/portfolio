import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HeaderComponent } from "../shared/header/header.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { AppBtnComponent } from "../app-btn/app-btn.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent, AppBtnComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  animations: [
    trigger('container', [
      state('off', style({ width: '120px' })),
      state('on', style({ width: '220px' })),
      transition('off => on', animate('360ms cubic-bezier(.22,.7,.2,1)')),
      transition('on  => off', animate('300ms cubic-bezier(.22,.7,.2,1)')),
    ]),

    trigger('fillLeft', [
      state('off', style({ transform: 'scaleX(0)' })),
      state('on', style({ transform: 'scaleX(1)' })),
      transition('off => on', animate('600ms cubic-bezier(.77, 0, .175, 1)')),  // langsamer & smooth
      transition('on => off', animate('450ms ease-out'))                         // langsames Zurückziehen
    ]),
    trigger('fillRight', [
      state('off', style({ transform: 'scaleX(0)' })),
      state('on', style({ transform: 'scaleX(1)' })),
      transition('off => on', animate('600ms cubic-bezier(.77, 0, .175, 1)')),
      transition('on => off', animate('450ms ease-out'))
    ]),

    trigger('baseFade', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible => hidden', animate('0ms ease-out')),
      transition('hidden  => visible', animate('250ms ease-in')),
    ]),

    trigger('altFade', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('300ms 120ms ease-in')),
      transition('visible => hidden', animate('200ms ease-out')),
    ]),
  ]
})
export class LandingPageComponent {
  hover = false;
}