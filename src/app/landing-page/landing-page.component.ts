// import { Component } from '@angular/core';
// import { HeaderComponent } from "../shared/header/header.component";
// import { NavbarComponent } from "../navbar/navbar.component";
// import { AppBtnComponent } from "../app-btn/app-btn.component";
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// @Component({
//   selector: 'app-landing-page',
//   imports: [
//     HeaderComponent,
//     NavbarComponent,
//     AppBtnComponent,
//     BrowserAnimationsModule,
// ],
//   templateUrl: './landing-page.component.html',
//   styleUrl: './landing-page.component.scss'
// })
// export class LandingPageComponent {

// }


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
    // Pill-Breite
    trigger('container', [
      state('off', style({ width: '120px' })),
      state('on',  style({ width: '220px' })),
      transition('off <=> on', animate('350ms ease'))
    ]),
    // Border fährt von links nach rechts (scaleX)
    trigger('borderScale', [
      state('off', style({ transform: 'scaleX(0)' })),
      state('on',  style({ transform: 'scaleX(1)' })),
      transition('off <=> on', animate('350ms ease'))
    ]),
    // Text-Fade
    trigger('textFade', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden <=> visible', animate('180ms ease'))
    ]),
  ]
})
export class LandingPageComponent {
  hover = false;
}