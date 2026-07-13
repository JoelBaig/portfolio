import { CommonModule, NgClass } from '@angular/common';

import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { RouterModule } from '@angular/router';

import {
  LangChangeEvent,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';

import { Subscription } from 'rxjs';

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
  isMenuClosing = false;

  private readonly menuAnimationDuration = 600;

  private langSub?: Subscription;
  private lockAfterScrollTimer?: number;
  private menuCloseTimer?: number;

  private afterCloseAction?: () => void;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initSelectedLanguage();
    this.subscribeToLanguageChanges();
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();

    this.clearLockTimer();
    this.clearMenuCloseTimer();
    this.cleanUpOpenMenu();
  }

  private initSelectedLanguage(): void {
    this.selectedLanguage = this.getCurrentLanguage();
    this.setDotPositionInstant(this.selectedLanguage);
  }

  private subscribeToLanguageChanges(): void {
    this.langSub = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.handleLanguageChange(event);
      }
    );
  }

  private handleLanguageChange(
    event: LangChangeEvent
  ): void {
    const lang = this.getLangFromEvent(event);

    this.selectedLanguage = lang;
    this.setDotPositionInstant(lang);
  }

  private getLangFromEvent(
    event: LangChangeEvent
  ): 'en' | 'de' {
    return event.lang === 'de'
      ? 'de'
      : 'en';
  }

  private getCurrentLanguage(): 'en' | 'de' {
    return this.translate.currentLang === 'de'
      ? 'de'
      : 'en';
  }

  onNavItemClick(
    fragment: string,
    event?: Event
  ): void {
    if (this.isMenuOpen || this.isMenuClosing) {
      event?.preventDefault();
      event?.stopPropagation();

      this.closeMenu(false, () => {
        this.navClick.emit(fragment);
      });

      return;
    }

    this.navClick.emit(fragment);
  }

  selectLanguage(
    lang: 'en' | 'de'
  ): void {
    if (lang === this.selectedLanguage) {
      return;
    }

    this.animateDotToLanguage(lang);
    this.selectedLanguage = lang;
    this.useLanguage(lang);
  }

  private animateDotToLanguage(
    lang: 'en' | 'de'
  ): void {
    this.dotClass = lang === 'de'
      ? 'dot-animate-right'
      : 'dot-animate-left';
  }

  private useLanguage(
    lang: 'en' | 'de'
  ): void {
    if (this.translate.currentLang !== lang) {
      this.translate.use(lang);
    }
  }

  private setDotPositionInstant(
    lang: 'en' | 'de'
  ): void {
    this.dotClass = lang === 'de'
      ? 'dot-right'
      : 'dot-left';
  }

  toggleMenu(): void {
    if (this.isDesktop() || this.isMenuClosing) {
      return;
    }

    if (this.isMenuOpen) {
      this.closeMenu();
      return;
    }

    this.openMenu();
  }

  private openMenu(): void {
    this.clearMenuCloseTimer();
    this.clearLockTimer();

    this.afterCloseAction = undefined;

    this.isMenuClosing = false;
    this.isMenuOpen = true;

    this.menuOpenChange.emit(true);

    this.hideMainContent();
    this.setLockTimer();
  }

  closeMenu(
    scrollToTop: boolean = true,
    afterClose?: () => void
  ): void {
    if (this.isMenuClosing) {
      return;
    }

    if (!this.isMenuOpen) {
      afterClose?.();
      return;
    }

    this.afterCloseAction = afterClose;

    /*
     * WICHTIG:
     *
     * Der Hauptinhalt wird bereits vor Beginn der Schließanimation
     * wieder eingeblendet.
     *
     * Dadurch wird beim Heraussliden des Menüs die Seite darunter
     * sichtbar. Vorher war der Hauptinhalt weiterhin mit d-none
     * ausgeblendet und das Menü hat beim Heraussliden nur eine
     * schwarze beziehungsweise leere Fläche freigegeben.
     */
    this.showMainContent();

    this.isMenuClosing = true;

    this.menuOpenChange.emit(false);

    this.clearLockTimer();
    this.clearMenuCloseTimer();

    this.menuCloseTimer = window.setTimeout(() => {
      this.finishClosingMenu(scrollToTop);
    }, this.menuAnimationDuration);
  }

  private finishClosingMenu(
    scrollToTop: boolean
  ): void {
    this.isMenuOpen = false;
    this.isMenuClosing = false;
    this.menuCloseTimer = undefined;

    this.unlockBodyScroll();
    this.scrollToTopIfNeeded(scrollToTop);

    const action = this.afterCloseAction;

    this.afterCloseAction = undefined;

    action?.();
  }

  private setLockTimer(): void {
    this.clearLockTimer();

    this.lockAfterScrollTimer = window.setTimeout(() => {
      this.lockBodyScrollAtTop();
    }, 450);
  }

  private clearLockTimer(): void {
    if (this.lockAfterScrollTimer === undefined) {
      return;
    }

    window.clearTimeout(this.lockAfterScrollTimer);
    this.lockAfterScrollTimer = undefined;
  }

  private clearMenuCloseTimer(): void {
    if (this.menuCloseTimer === undefined) {
      return;
    }

    window.clearTimeout(this.menuCloseTimer);
    this.menuCloseTimer = undefined;
  }

  private lockBodyScrollAtTop(): void {
    this.addScrollLockClasses();
    this.setFixedBodyStyles();
  }

  private addScrollLockClasses(): void {
    document.documentElement.classList.add('no-scroll');

    document.body.classList.add(
      'no-scroll',
      'menu-open'
    );
  }

  private setFixedBodyStyles(): void {
    document.body.style.position = 'fixed';
    document.body.style.top = '0';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  private unlockBodyScroll(): void {
    this.removeScrollLockClasses();
    this.resetBodyStyles();
  }

  private removeScrollLockClasses(): void {
    document.documentElement.classList.remove('no-scroll');

    document.body.classList.remove(
      'no-scroll',
      'menu-open'
    );
  }

  private resetBodyStyles(): void {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
  }

  private hideMainContent(): void {
    document
      .getElementById('mainContent')
      ?.classList.add('d-none');
  }

  private showMainContent(): void {
    document
      .getElementById('mainContent')
      ?.classList.remove('d-none');
  }

  private scrollToTopIfNeeded(
    scrollToTop: boolean
  ): void {
    if (!scrollToTop) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }

  private cleanUpOpenMenu(): void {
    if (!this.isMenuOpen && !this.isMenuClosing) {
      return;
    }

    this.isMenuOpen = false;
    this.isMenuClosing = false;
    this.afterCloseAction = undefined;

    this.menuOpenChange.emit(false);

    this.unlockBodyScroll();
    this.showMainContent();
  }

  private closeMenuImmediately(): void {
    this.clearLockTimer();
    this.clearMenuCloseTimer();

    this.isMenuOpen = false;
    this.isMenuClosing = false;
    this.afterCloseAction = undefined;

    this.menuOpenChange.emit(false);

    this.unlockBodyScroll();
    this.showMainContent();
  }

  private isDesktop(): boolean {
    return window.innerWidth > 900;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isMenuOpen && !this.isMenuClosing) {
      this.closeMenu(false);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (
      this.isDesktop() &&
      (this.isMenuOpen || this.isMenuClosing)
    ) {
      this.closeMenuImmediately();
    }
  }

  onLogoClick(
    event: MouseEvent
  ): void {
    if (this.isMenuOpen || this.isMenuClosing) {
      event.preventDefault();
      event.stopPropagation();

      this.closeMenu(false, () => {
        this.handleLogoNavigation();
      });

      return;
    }

    this.handleLogoNavigation(event);
  }

  private handleLogoNavigation(
    event?: MouseEvent
  ): void {
    if (this.variant === 'overlay') {
      event?.preventDefault();
      this.navClick.emit('top');
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}