import { Component, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
// import { HeaderComponent } from "../shared/header/header.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { AppBtnComponent } from "../app-btn/app-btn.component";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    // HeaderComponent,
    NavbarComponent,
    AppBtnComponent,
    CommonModule,
    TranslateModule,
],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  animations: [
    trigger('container', [
      state('off', style({ width: '116px' })),
      state('on', style({ width: '220px' })),
      transition('off => on', animate('360ms cubic-bezier(.22,.7,.2,1)')),
      transition('on  => off', animate('300ms cubic-bezier(.22,.7,.2,1)')),
    ]),

    trigger('fillLeft', [
      state('off', style({ transform: 'scaleX(0)' })),
      state('on', style({ transform: 'scaleX(1)' })),
      transition('off => on', animate('600ms cubic-bezier(.77, 0, .175, 1)')),
      transition('on => off', animate('450ms ease-out'))
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
  hoverImg = false;
  hasInteracted = false;
  activeSection: string | null = null;

  onEnter() {
    this.hover = true;
    this.hoverImg = true;
    this.hasInteracted = true;
  }

  onLeave() {
    this.hover = false;
    this.hoverImg = false;
  }

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection = sectionId;
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const sections = ['about-me', 'skills', 'projects', 'contact'];
    let found = false;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          this.activeSection = id;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      this.activeSection = null;
    }
  }
}