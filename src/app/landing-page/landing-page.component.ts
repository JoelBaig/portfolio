import { Component, HostListener, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavbarComponent } from "../navbar/navbar.component";
import { AppBtnComponent } from "../app-btn/app-btn.component";
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

/**
 * Displays the landing page hero section, including headline animations,
 * hover states, language updates and section navigation.
 */
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

  /**
   * Renders animated headline letters after the view is initialized
   * and updates them whenever the active language changes.
   */
  ngAfterViewInit(): void {
    this.renderHeadlines();
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.renderHeadlines();
    });
  }

  /**
   * Cleans up the language change subscription when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  /**
   * Loads the translated headline texts and renders them as interactive letters.
   */
  private renderHeadlines(): void {
    this.translate.get(['LANDING_PAGE.FRONTEND', 'LANDING_PAGE.DEVELOPER']).subscribe(t => {
      this.buildLetters('headlineFrontend', t['LANDING_PAGE.FRONTEND'] ?? 'Frontend');
      this.buildLetters('headlineDeveloper', t['LANDING_PAGE.DEVELOPER'] ?? 'Developer');
    });
  }

  /**
   * Builds interactive letter elements for the given headline container.
   *
   * @param elementId The id of the headline container element.
   * @param text The text that should be split into interactive letters.
   */
  private buildLetters(elementId: string, text: string): void {
    const container = document.getElementById(elementId);

    if (!container) {
      return;
    }

    this.prepareLetterContainer(container);
    this.appendLetters(container, text);
  }

  /**
   * Clears the headline container and registers a mouse leave reset handler.
   *
   * @param container The headline container element.
   */
  private prepareLetterContainer(container: HTMLElement): void {
    container.textContent = '';
    container.onmouseleave = () => this.resetLettersInside(container);
  }

  /**
   * Appends all characters of a text to the given container.
   *
   * @param container The container receiving the characters.
   * @param text The text that should be rendered.
   */
  private appendLetters(container: HTMLElement, text: string): void {
    text.split('').forEach((char) => {
      this.appendCharacter(container, char);
    });
  }

  /**
   * Appends either a plain text node for spaces or an interactive span for letters.
   *
   * @param container The container receiving the character.
   * @param char The character to append.
   */
  private appendCharacter(container: HTMLElement, char: string): void {
    if (this.isSpace(char)) {
      container.appendChild(document.createTextNode(char));
      return;
    }

    container.appendChild(this.createLetterSpan(char));
  }

  /**
   * Checks whether a character is whitespace.
   *
   * @param char The character to check.
   * @returns True if the character is whitespace.
   */
  private isSpace(char: string): boolean {
    return /\s/.test(char);
  }

  /**
   * Creates an interactive span element for a headline character.
   *
   * @param char The character displayed inside the span.
   * @returns The created span element.
   */
  private createLetterSpan(char: string): HTMLSpanElement {
    const span = document.createElement('span');

    span.textContent = char;
    span.classList.add('letter');
    span.dataset['originalChar'] = char;
    this.addLetterEvents(span);

    return span;
  }

  /**
   * Registers hover events for an interactive headline letter.
   *
   * @param span The letter span element.
   */
  private addLetterEvents(span: HTMLSpanElement): void {
    span.addEventListener('mouseenter', () => {
      this.toggleLetterCase(span);
    });

    span.addEventListener('mouseleave', () => {
      this.resetLetter(span);
    });
  }

  /**
   * Toggles the letter case of the given span based on its original character.
   *
   * @param span The letter span element.
   */
  private toggleLetterCase(span: HTMLSpanElement): void {
    const original = span.dataset['originalChar'] ?? '';

    if (!original) {
      return;
    }

    span.textContent = this.getToggledCase(original);
  }

  /**
   * Returns the opposite case of the given character.
   *
   * @param char The character to toggle.
   * @returns The toggled character.
   */
  private getToggledCase(char: string): string {
    return char === char.toUpperCase()
      ? char.toLowerCase()
      : char.toUpperCase();
  }

  /**
   * Resets a letter span back to its original character.
   *
   * @param span The letter span element.
   */
  private resetLetter(span: HTMLElement): void {
    const original = span.dataset['originalChar'];

    if (original) {
      span.textContent = original;
    }
  }

  /**
   * Resets all interactive letters inside a container.
   *
   * @param container The container whose letters should be reset.
   */
  private resetLettersInside(container: HTMLElement): void {
    container.querySelectorAll<HTMLElement>('.letter').forEach((el) => {
      this.resetLetter(el);
    });
  }

  /**
   * Activates the hover state for the main landing page visual elements.
   */
  onEnter(): void {
    this.hover = true;
    this.hoverImg = true;
    this.hasInteracted = true;
  }

  /**
   * Deactivates the hover state for the main landing page visual elements.
   */
  onLeave(): void {
    this.hover = false;
    this.hoverImg = false;
  }

  /**
   * Smoothly scrolls to a page section and stores it as active.
   *
   * @param sectionId The id of the target section.
   */
  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection = sectionId;
    }
  }

  /**
   * Updates the active section based on the current scroll position.
   */
  @HostListener('window:scroll', [])
  onScroll(): void {
    const sections = ['about-me', 'skills', 'projects', 'contact'];
    const activeSection = sections.find((id) => this.isSectionActive(id));

    this.activeSection = activeSection ?? null;
  }

  /**
   * Checks whether the given section is currently inside the active viewport area.
   *
   * @param sectionId The id of the section to check.
   * @returns True if the section crosses the active scroll position.
   */
  private isSectionActive(sectionId: string): boolean {
    const section = document.getElementById(sectionId);

    if (!section) {
      return false;
    }

    return this.isInsideActiveArea(section.getBoundingClientRect());
  }

  /**
   * Checks whether a section rectangle crosses the active viewport position.
   *
   * @param rect The section's current viewport rectangle.
   * @returns True if the active position lies inside the rectangle.
   */
  private isInsideActiveArea(rect: DOMRect): boolean {
    const activePosition = 150;

    return rect.top <= activePosition
      && rect.bottom >= activePosition;
  }
}