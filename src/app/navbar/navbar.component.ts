import { CommonModule, NgClass } from '@angular/common';
import {
  Component,
  HostListener,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';

import { RouterModule } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
  LangChangeEvent
} from '@ngx-translate/core';

import { Subscription } from 'rxjs';

/**
 * Displays the main navigation bar, handles language switching,
 * mobile menu behavior and scroll locking while the menu is open.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    TranslateModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() navClick = new EventEmitter<string>();
  @Output() menuOpenChange = new EventEmitter<boolean>();

  @Input() variant: 'default' | 'overlay' = 'default';

  activeSection: string | null = null;
  selectedLanguage: 'en' | 'de' = 'en';
  dotClass = '';
  isMenuOpen = false;

  private langSub?: Subscription;
  private lockAfterScrollTimer?: number;

  constructor(private translate: TranslateService) { }

  /**
   * Initializes the selected language and subscribes to language changes.
   */
  ngOnInit(): void {
    this.initSelectedLanguage();
    this.subscribeToLanguageChanges();
  }

  /**
   * Cleans up subscriptions, timers and open menu states.
   */
  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.clearLockTimer();
    this.cleanUpOpenMenu();
  }

  /**
   * Sets the initial selected language and dot position.
   */
  private initSelectedLanguage(): void {
    this.selectedLanguage = this.getCurrentLanguage();
    this.setDotPositionInstant(this.selectedLanguage);
  }

  /**
   * Subscribes to language change events from the translation service.
   */
  private subscribeToLanguageChanges(): void {
    this.langSub = this.translate.onLangChange.subscribe((e) => {
      this.handleLanguageChange(e);
    });
  }

  /**
   * Updates the selected language and dot position after a language change.
   *
   * @param e The language change event.
   */
  private handleLanguageChange(e: LangChangeEvent): void {
    const lang = this.getLangFromEvent(e);
    this.selectedLanguage = lang;
    this.setDotPositionInstant(lang);
  }

  /**
   * Extracts the supported language value from a language change event.
   *
   * @param e The language change event.
   * @returns The resolved language value.
   */
  private getLangFromEvent(e: LangChangeEvent): 'en' | 'de' {
    return (e.lang as 'en' | 'de') ?? 'en';
  }

  /**
   * Returns the currently active language from the translation service.
   *
   * @returns The current language value.
   */
  private getCurrentLanguage(): 'en' | 'de' {
    return (this.translate.currentLang as 'en' | 'de') ?? 'en';
  }

  /**
   * Restores page state if the mobile menu is still open during cleanup.
   */
  private cleanUpOpenMenu(): void {
    if (!this.isMenuOpen) {
      return;
    }

    this.menuOpenChange.emit(false);
    this.unlockBodyScroll();
  }

  /**
   * Closes the mobile menu and emits the selected navigation fragment.
   *
   * @param fragment The target section fragment.
   */
  onNavItemClick(fragment: string): void {
    this.closeMenu(false);
    this.navClick.emit(fragment);
  }

  /**
   * Changes the active language and starts the language toggle animation.
   *
   * @param lang The selected language.
   */
  selectLanguage(lang: 'en' | 'de'): void {
    if (lang === this.selectedLanguage) {
      return;
    }

    this.animateDotToLanguage(lang);
    this.selectedLanguage = lang;
    this.useLanguage(lang);
  }

  /**
   * Sets the animated dot class for the selected language.
   *
   * @param lang The selected language.
   */
  private animateDotToLanguage(lang: 'en' | 'de'): void {
    this.dotClass = lang === 'de'
      ? 'dot-animate-right'
      : 'dot-animate-left';
  }

  /**
   * Updates the translation service language when needed.
   *
   * @param lang The selected language.
   */
  private useLanguage(lang: 'en' | 'de'): void {
    if (this.translate.currentLang !== lang) {
      this.translate.use(lang);
    }
  }

  /**
   * Sets the language dot position without animation.
   *
   * @param lang The selected language.
   */
  private setDotPositionInstant(lang: 'en' | 'de'): void {
    this.dotClass = lang === 'de'
      ? 'dot-right'
      : 'dot-left';
  }

  /**
   * Toggles the mobile menu when the viewport is not in desktop mode.
   */
  toggleMenu(): void {
    if (this.isDesktop()) {
      return;
    }

    this.isMenuOpen = !this.isMenuOpen;
    this.menuOpenChange.emit(this.isMenuOpen);
    this.handleMenuState();
  }

  /**
   * Opens or closes the menu depending on the current menu state.
   */
  private handleMenuState(): void {
    if (this.isMenuOpen) {
      this.openMenu();
      return;
    }

    this.closeMenuWithoutScroll();
  }

  /**
   * Opens the mobile menu and hides the main content.
   */
  private openMenu(): void {
    this.setLockTimer();
    this.hideMainContent();
  }

  /**
   * Closes the mobile menu without scrolling the page to the top.
   */
  private closeMenuWithoutScroll(): void {
    this.clearLockTimer();
    this.unlockBodyScroll();
    this.showMainContent();
  }

  /**
   * Starts the timer that locks the body scroll after the menu animation.
   */
  private setLockTimer(): void {
    this.lockAfterScrollTimer = window.setTimeout(() => {
      this.lockBodyScrollAtTop();
    }, 450);
  }

  /**
   * Closes the mobile menu and optionally scrolls the page to the top.
   *
   * @param scrollToTop Indicates whether the page should scroll to the top.
   */
  closeMenu(scrollToTop: boolean = true): void {
    if (!this.isMenuOpen) {
      return;
    }

    this.isMenuOpen = false;
    this.menuOpenChange.emit(false);
    this.closeMenuWithoutScroll();
    this.scrollToTopIfNeeded(scrollToTop);
  }

  /**
   * Scrolls the page to the top if enabled.
   *
   * @param scrollToTop Indicates whether scrolling should be performed.
   */
  private scrollToTopIfNeeded(scrollToTop: boolean): void {
    if (!scrollToTop) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }

  /**
   * Clears the delayed body scroll lock timer.
   */
  private clearLockTimer(): void {
    if (!this.lockAfterScrollTimer) {
      return;
    }

    window.clearTimeout(this.lockAfterScrollTimer);
    this.lockAfterScrollTimer = undefined;
  }

  /**
   * Locks page scrolling and fixes the body position at the top.
   */
  private lockBodyScrollAtTop(): void {
    this.addScrollLockClasses();
    this.setFixedBodyStyles();
  }

  /**
   * Adds CSS classes used to lock scrolling.
   */
  private addScrollLockClasses(): void {
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll', 'menu-open');
  }

  /**
   * Applies fixed body styles while the menu is open.
   */
  private setFixedBodyStyles(): void {
    document.body.style.position = 'fixed';
    document.body.style.top = '0px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  /**
   * Unlocks page scrolling and resets fixed body styles.
   */
  private unlockBodyScroll(): void {
    this.removeScrollLockClasses();
    this.resetBodyStyles();
  }

  /**
   * Removes CSS classes used to lock scrolling.
   */
  private removeScrollLockClasses(): void {
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll', 'menu-open');
  }

  /**
   * Resets body styles that were applied during menu locking.
   */
  private resetBodyStyles(): void {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
  }

  /**
   * Hides the main page content while the mobile menu is open.
   */
  private hideMainContent(): void {
    document.getElementById('mainContent')?.classList.add('d-none');
  }

  /**
   * Shows the main page content again after the mobile menu is closed.
   */
  private showMainContent(): void {
    document.getElementById('mainContent')?.classList.remove('d-none');
  }

  /**
   * Checks whether the current viewport should be treated as desktop.
   *
   * @returns True if the viewport width is greater than 900 pixels.
   */
  private isDesktop(): boolean {
    return window.innerWidth > 900;
  }

  /**
   * Closes the mobile menu when the Escape key is pressed.
   */
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }

  /**
   * Closes the mobile menu when resizing from mobile to desktop.
   */
  @HostListener('window:resize')
  onResize(): void {
    if (this.isDesktop() && this.isMenuOpen) {
      this.closeMenu();
    }
  }
}