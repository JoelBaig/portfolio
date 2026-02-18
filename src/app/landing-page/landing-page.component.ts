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
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.renderHeadlines();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  private renderHeadlines(): void {
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