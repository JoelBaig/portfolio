// import { Component, HostListener, AfterViewInit, OnDestroy, inject } from '@angular/core';
// import { trigger, state, style, transition, animate } from '@angular/animations';
// import { NavbarComponent } from "../navbar/navbar.component";
// import { AppBtnComponent } from "../app-btn/app-btn.component";
// import { CommonModule } from '@angular/common';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-landing-page',
//   standalone: true,
//   imports: [
//     NavbarComponent,
//     AppBtnComponent,
//     CommonModule,
//     TranslateModule,
//   ],
//   templateUrl: './landing-page.component.html',
//   styleUrl: './landing-page.component.scss',
//   animations: [
//     trigger('container', [
//       state('off', style({ width: '116px' })),
//       state('on', style({ width: '220px' })),
//       transition('off => on', animate('360ms cubic-bezier(.22,.7,.2,1)')),
//       transition('on  => off', animate('300ms cubic-bezier(.22,.7,.2,1)')),
//     ]),
//     trigger('fillLeft', [
//       state('off', style({ transform: 'scaleX(0)' })),
//       state('on', style({ transform: 'scaleX(1)' })),
//       transition('off => on', animate('600ms cubic-bezier(.77, 0, .175, 1)')),
//       transition('on => off', animate('450ms ease-out'))
//     ]),
//     trigger('fillRight', [
//       state('off', style({ transform: 'scaleX(0)' })),
//       state('on', style({ transform: 'scaleX(1)' })),
//       transition('off => on', animate('600ms cubic-bezier(.77, 0, .175, 1)')),
//       transition('on => off', animate('450ms ease-out'))
//     ]),
//     trigger('baseFade', [
//       state('visible', style({ opacity: 1 })),
//       state('hidden', style({ opacity: 0 })),
//       transition('visible => hidden', animate('0ms ease-out')),
//       transition('hidden  => visible', animate('250ms ease-in')),
//     ]),
//     trigger('altFade', [
//       state('hidden', style({ opacity: 0 })),
//       state('visible', style({ opacity: 1 })),
//       transition('hidden => visible', animate('300ms 120ms ease-in')),
//       transition('visible => hidden', animate('200ms ease-out')),
//     ]),
//   ]
// })
// export class LandingPageComponent implements AfterViewInit, OnDestroy {
//   private translate = inject(TranslateService);
//   private langSub?: Subscription;

//   hover = false;
//   hoverImg = false;
//   hasInteracted = false;
//   activeSection: string | null = null;

//   ngAfterViewInit(): void {
//     this.buildHeadlines();

//     // ✅ Wenn Sprache wechselt: nach dem Render neu bauen
//     this.langSub = this.translate.onLangChange.subscribe(() => {
//       requestAnimationFrame(() => this.buildHeadlines());
//     });
//   }

//   ngOnDestroy(): void {
//     this.langSub?.unsubscribe();
//   }

//   private buildHeadlines(): void {
//     // vorher alles zurücksetzen (falls was hängen blieb)
//     this.resetAllLetters();

//     this.setupHoverLetters('headlineFrontend');
//     this.setupHoverLetters('headlineDeveloper');

//     // sicherheitshalber nochmal reset
//     this.resetAllLetters();
//   }

//   private setupHoverLetters(elementId: string): void {
//     const container = document.getElementById(elementId);
//     if (!container) return;

//     const word = (container.textContent ?? '').trim();
//     container.textContent = '';

//     // ✅ wenn Maus Container verlässt -> alle Buchstaben zurück
//     container.onmouseleave = () => this.resetLettersInside(container);

//     word.split('').forEach((char: string) => {
//       if (/\s/.test(char)) {
//         container.appendChild(document.createTextNode(char));
//         return;
//       }

//       const span = document.createElement('span');
//       span.textContent = char;
//       span.classList.add('letter');
//       span.dataset['originalChar'] = char;

//       span.addEventListener('mouseenter', () => {
//         const original = span.dataset['originalChar'] ?? '';
//         if (!original) return;

//         const isUpper = original === original.toUpperCase();
//         span.textContent = isUpper ? original.toLowerCase() : original.toUpperCase();
//       });

//       span.addEventListener('mouseleave', () => {
//         const original = span.dataset['originalChar'] ?? '';
//         if (!original) return;
//         span.textContent = original;
//       });

//       container.appendChild(span);
//     });
//   }

//   private resetLettersInside(container: HTMLElement): void {
//     container.querySelectorAll<HTMLElement>('.letter').forEach((el) => {
//       const original = el.dataset['originalChar'];
//       if (original != null) el.textContent = original;
//     });
//   }

//   private resetAllLetters(): void {
//     document.querySelectorAll<HTMLElement>('.letter').forEach((el) => {
//       const original = el.dataset['originalChar'];
//       if (original != null) el.textContent = original;
//     });
//   }

//   onEnter() {
//     this.hover = true;
//     this.hoverImg = true;
//     this.hasInteracted = true;
//   }

//   onLeave() {
//     this.hover = false;
//     this.hoverImg = false;
//   }

//   scrollToSection(sectionId: string) {
//     const section = document.getElementById(sectionId);
//     if (section) {
//       section.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       this.activeSection = sectionId;
//     }
//   }

//   @HostListener('window:scroll', [])
//   onScroll() {
//     const sections = ['about-me', 'skills', 'projects', 'contact'];
//     for (const id of sections) {
//       const el = document.getElementById(id);
//       if (!el) continue;

//       const rect = el.getBoundingClientRect();
//       if (rect.top <= 150 && rect.bottom >= 150) {
//         this.activeSection = id;
//         return;
//       }
//     }
//     this.activeSection = null;
//   }
// }



import { Component, HostListener, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavbarComponent } from "../navbar/navbar.component";
import { AppBtnComponent } from "../app-btn/app-btn.component";
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
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
  ]
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  private translate = inject(TranslateService);
  private langSub?: Subscription;

  hover = false;
  hoverImg = false;
  hasInteracted = false;
  activeSection: string | null = null;

  ngAfterViewInit(): void {
    this.renderHeadlines();

    // bei Sprachwechsel: neu rendern (nachdem Translate geladen hat)
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.renderHeadlines();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  private renderHeadlines(): void {
    // translations sicher holen
    this.translate.get(['LANDING_PAGE.FRONTEND', 'LANDING_PAGE.DEVELOPER']).subscribe(t => {
      this.buildLetters('headlineFrontend', t['LANDING_PAGE.FRONTEND'] ?? 'Frontend');
      this.buildLetters('headlineDeveloper', t['LANDING_PAGE.DEVELOPER'] ?? 'Developer');
    });
  }

  private buildLetters(elementId: string, text: string): void {
    const container = document.getElementById(elementId);
    if (!container) return;

    container.textContent = '';
    container.onmouseleave = () => this.resetLettersInside(container);

    text.split('').forEach((char) => {
      if (/\s/.test(char)) {
        container.appendChild(document.createTextNode(char));
        return;
      }

      const span = document.createElement('span');
      span.textContent = char;
      span.classList.add('letter');
      span.dataset['originalChar'] = char;

      span.addEventListener('mouseenter', () => {
        const original = span.dataset['originalChar'] ?? '';
        if (!original) return;
        const isUpper = original === original.toUpperCase();
        span.textContent = isUpper ? original.toLowerCase() : original.toUpperCase();
      });

      span.addEventListener('mouseleave', () => {
        const original = span.dataset['originalChar'] ?? '';
        if (original) span.textContent = original;
      });

      container.appendChild(span);
    });
  }

  private resetLettersInside(container: HTMLElement): void {
    container.querySelectorAll<HTMLElement>('.letter').forEach((el) => {
      const original = el.dataset['originalChar'];
      if (original != null) el.textContent = original;
    });
  }

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
    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        this.activeSection = id;
        return;
      }
    }
    this.activeSection = null;
  }
}