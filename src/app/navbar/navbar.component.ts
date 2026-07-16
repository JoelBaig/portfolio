import {
  CommonModule,
  NgClass
} from '@angular/common';

import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import {
  NavigationEnd,
  Router,
  RouterModule
} from '@angular/router';

import {
  LangChangeEvent,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';

import {
  filter,
  Subscription
} from 'rxjs';

type Language = 'en' | 'de';
type NavbarVariant = 'default' | 'overlay';

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

  @Input() variant: NavbarVariant = 'default';

  activeSection: string | null = null;
  selectedLanguage: Language = 'en';
  dotClass = '';

  isMenuOpen = false;
  isMenuClosing = false;
  isMenuVisible = false;

  private readonly menuAnimationDuration = 250;

  private langSub?: Subscription;
  private routerSub?: Subscription;
  private menuCloseTimer?: number;
  private openAnimationFrame?: number;
  private secondOpenAnimationFrame?: number;
  private afterCloseAction?: () => void;
  private savedScrollPosition = 0;

  /**
   * Erstellt die Navbar und injiziert benötigte Dienste.
   */
  constructor(
    private translate: TranslateService,
    private router: Router
  ) { }

  /**
   * Initialisiert Sprache und Router-Abonnements.
   */
  ngOnInit(): void {
    this.initSelectedLanguage();
    this.subscribeToLanguageChanges();
    this.subscribeToRouterEvents();
  }

  /**
   * Entfernt Abonnements, Timer und Menü-Zustände.
   */
  ngOnDestroy(): void {
    this.unsubscribeFromServices();
    this.clearOpenAnimationFrames();
    this.clearMenuCloseTimer();
    this.cleanUpOpenMenu();
  }

  /**
   * Beendet alle aktiven Abonnements.
   */
  private unsubscribeFromServices(): void {
    this.langSub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }

  /**
   * Initialisiert die aktuell ausgewählte Sprache.
   */
  private initSelectedLanguage(): void {
    this.selectedLanguage = this.getCurrentLanguage();
    this.setDotPositionInstant(this.selectedLanguage);
  }

  /**
   * Reagiert auf Änderungen der aktiven Sprache.
   */
  private subscribeToLanguageChanges(): void {
    this.langSub = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => this.handleLanguageChange(event)
    );
  }

  /**
   * Reagiert auf abgeschlossene Router-Navigationen.
   */
  private subscribeToRouterEvents(): void {
    this.routerSub = this.router.events
      .pipe(filter(this.isNavigationEnd))
      .subscribe(() => this.handleNavigationEnd());
  }

  /**
   * Prüft, ob ein Router-Event eine NavigationEnd-Instanz ist.
   */
  private isNavigationEnd(
    event: unknown
  ): event is NavigationEnd {
    return event instanceof NavigationEnd;
  }

  /**
   * Scrollt nach einer Navigation zum URL-Fragment.
   */
  private handleNavigationEnd(): void {
    const fragment = this.getFragmentFromUrl(this.router.url);

    if (fragment) {
      this.scrollToFragment(fragment);
    }
  }

  /**
   * Übernimmt eine Änderung der Anwendungssprache.
   */
  private handleLanguageChange(
    event: LangChangeEvent
  ): void {
    const language = this.getLangFromEvent(event);
    this.selectedLanguage = language;
    this.setDotPositionInstant(language);
  }

  /**
   * Ermittelt die Sprache aus einem Sprachereignis.
   */
  private getLangFromEvent(
    event: LangChangeEvent
  ): Language {
    return event.lang === 'de' ? 'de' : 'en';
  }

  /**
   * Gibt die momentan aktive Sprache zurück.
   */
  private getCurrentLanguage(): Language {
    return this.translate.currentLang === 'de' ? 'de' : 'en';
  }

  /**
   * Verarbeitet den Klick auf einen Navigationspunkt.
   */
  onNavItemClick(
    fragment: string,
    event?: Event
  ): void {
    if (this.isMenuActive()) {
      this.handleMobileNavClick(fragment, event);
      return;
    }

    this.handleDesktopNavClick(fragment, event);
  }

  /**
   * Prüft, ob das mobile Menü aktiv ist.
   */
  private isMenuActive(): boolean {
    return this.isMenuOpen || this.isMenuClosing;
  }

  /**
   * Schließt das Menü und navigiert danach zum Fragment.
   */
  private handleMobileNavClick(
    fragment: string,
    event?: Event
  ): void {
    this.preventNavigationEvent(event);
    this.closeMenu(false, () => this.navigateToFragment(fragment));
  }

  /**
   * Verarbeitet eine Navigation ohne geöffnetes Mobilmenü.
   */
  private handleDesktopNavClick(
    fragment: string,
    event?: Event
  ): void {
    if (this.variant === 'overlay') {
      event?.preventDefault();
    }

    this.navClick.emit(fragment);
  }

  /**
   * Verhindert das Standardverhalten eines Events.
   */
  private preventNavigationEvent(
    event?: Event
  ): void {
    event?.preventDefault();
    event?.stopPropagation();
  }

  /**
   * Navigiert abhängig von der aktuellen Navbar-Variante.
   */
  private navigateToFragment(
    fragment: string
  ): void {
    if (this.variant === 'overlay') {
      this.navClick.emit(fragment);
      return;
    }

    this.navigateFromLandingOrSubpage(fragment);
  }

  /**
   * Navigiert innerhalb oder zurück zur Landingpage.
   */
  private navigateFromLandingOrSubpage(
    fragment: string
  ): void {
    if (this.isLandingPageUrl(this.router.url)) {
      this.navigateWithinLandingPage(fragment);
      return;
    }

    this.navigateToLandingPage(fragment);
  }

  /**
   * Ändert das Fragment innerhalb der Landingpage.
   */
  private navigateWithinLandingPage(
    fragment: string
  ): void {
    this.updateUrlFragment(fragment);
  }

  /**
   * Navigiert von einer Unterseite zur Landingpage.
   */
  private navigateToLandingPage(
    fragment: string
  ): void {
    void this.router.navigate(['/'], { fragment });
  }

  /**
   * Prüft, ob eine URL zur Landingpage gehört.
   */
  private isLandingPageUrl(
    url: string
  ): boolean {
    const path = this.getUrlPath(url);
    return path === '/' || path === '';
  }

  /**
   * Entfernt Fragment und Query-Parameter aus einer URL.
   */
  private getUrlPath(
    url: string
  ): string {
    return url.split('#')[0].split('?')[0];
  }

  /**
   * Aktualisiert das Fragment der aktuellen URL.
   */
  private updateUrlFragment(
    fragment: string
  ): void {
    void this.router.navigate([], {
      fragment,
      replaceUrl: false
    });
  }

  /**
   * Plant das Scrollen zum Fragment.
   */
  private scrollToFragment(
    fragment: string
  ): void {
    window.requestAnimationFrame(
      () => this.scheduleFragmentScroll(fragment)
    );
  }

  /**
   * Wartet einen weiteren Frame vor dem Scrollen.
   */
  private scheduleFragmentScroll(
    fragment: string
  ): void {
    window.requestAnimationFrame(
      () => this.performFragmentScroll(fragment)
    );
  }

  /**
   * Scrollt zum Element des angegebenen Fragments.
   */
  private performFragmentScroll(
    fragment: string
  ): void {
    const element = document.getElementById(fragment);

    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  /**
   * Liest das Fragment aus einer URL.
   */
  private getFragmentFromUrl(
    url: string
  ): string | null {
    const hashIndex = url.indexOf('#');

    if (hashIndex === -1) {
      return null;
    }

    return url.slice(hashIndex + 1) || null;
  }

  /**
   * Aktiviert eine ausgewählte Sprache.
   */
  selectLanguage(
    language: Language
  ): void {
    if (language === this.selectedLanguage) {
      return;
    }

    this.applyLanguageSelection(language);
  }

  /**
   * Aktualisiert Sprache und Sprachumschalter.
   */
  private applyLanguageSelection(
    language: Language
  ): void {
    this.animateDotToLanguage(language);
    this.selectedLanguage = language;
    this.useLanguage(language);
  }

  /**
   * Startet die Animation des Sprachpunktes.
   */
  private animateDotToLanguage(
    language: Language
  ): void {
    this.dotClass = language === 'de'
      ? 'dot-animate-right'
      : 'dot-animate-left';
  }

  /**
   * Aktiviert eine Sprache im Übersetzungsdienst.
   */
  private useLanguage(
    language: Language
  ): void {
    if (this.translate.currentLang !== language) {
      this.translate.use(language);
    }
  }

  /**
   * Positioniert den Sprachpunkt ohne Animation.
   */
  private setDotPositionInstant(
    language: Language
  ): void {
    this.dotClass = language === 'de'
      ? 'dot-right'
      : 'dot-left';
  }

  /**
   * Öffnet oder schließt das mobile Menü.
   */
  toggleMenu(): void {
    if (!this.canToggleMenu()) {
      return;
    }

    this.isMenuOpen
      ? this.closeMenu(false)
      : this.openMenu();
  }

  /**
   * Prüft, ob das Menü bedient werden darf.
   */
  private canToggleMenu(): boolean {
    return !this.isDesktop() && !this.isMenuClosing;
  }

  /**
   * Öffnet das mobile Menü.
   */
  private openMenu(): void {
    this.clearMenuAnimations();
    this.resetAfterCloseAction();
    this.setOpeningMenuState();
    this.menuOpenChange.emit(true);
    this.lockBodyScroll();
    this.scheduleMenuOpening();
  }

  /**
   * Löscht Timer und Animation-Frames.
   */
  private clearMenuAnimations(): void {
    this.clearMenuCloseTimer();
    this.clearOpenAnimationFrames();
  }

  /**
   * Entfernt eine gespeicherte Aktion.
   */
  private resetAfterCloseAction(): void {
    this.afterCloseAction = undefined;
  }

  /**
   * Setzt den Zustand für die Öffnungsanimation.
   */
  private setOpeningMenuState(): void {
    this.isMenuOpen = true;
    this.isMenuClosing = false;
    this.isMenuVisible = false;
  }

  /**
   * Plant den Start der Öffnungsanimation.
   */
  private scheduleMenuOpening(): void {
    this.openAnimationFrame = window.requestAnimationFrame(
      () => this.scheduleMenuVisibility()
    );
  }

  /**
   * Wartet einen weiteren Frame vor dem Einblenden.
   */
  private scheduleMenuVisibility(): void {
    this.secondOpenAnimationFrame = window.requestAnimationFrame(
      () => this.showMenu()
    );
  }

  /**
   * Setzt das mobile Menü sichtbar.
   */
  private showMenu(): void {
    this.isMenuVisible = true;
  }

  /**
   * Startet das Schließen des mobilen Menüs.
   */
  closeMenu(
    scrollToTop: boolean = false,
    afterClose?: () => void
  ): void {
    if (this.isMenuClosing) {
      return;
    }

    this.isMenuOpen
      ? this.startClosingMenu(scrollToTop, afterClose)
      : afterClose?.();
  }

  /**
   * Bereitet die Schließanimation vor.
   */
  private startClosingMenu(
    scrollToTop: boolean,
    afterClose?: () => void
  ): void {
    this.afterCloseAction = afterClose;
    this.clearMenuAnimations();
    this.setClosingMenuState();
    this.menuOpenChange.emit(false);
    this.scheduleMenuClosing(scrollToTop);
  }

  /**
   * Setzt den Zustand für die Schließanimation.
   */
  private setClosingMenuState(): void {
    this.isMenuClosing = true;
    this.isMenuVisible = false;
  }

  /**
   * Plant das Ende der Schließanimation.
   */
  private scheduleMenuClosing(
    scrollToTop: boolean
  ): void {
    this.menuCloseTimer = window.setTimeout(
      () => this.finishClosingMenu(scrollToTop),
      this.menuAnimationDuration
    );
  }

  /**
   * Beendet die Schließanimation vollständig.
   */
  private finishClosingMenu(
    scrollToTop: boolean
  ): void {
    const restorePosition = !this.afterCloseAction;
    this.resetMenuState();
    this.menuCloseTimer = undefined;
    this.unlockBodyScroll(restorePosition);
    this.scrollToTopIfRequired(scrollToTop);
    this.runAfterCloseAction();
  }

  /**
   * Setzt alle Menü-Zustände zurück.
   */
  private resetMenuState(): void {
    this.isMenuOpen = false;
    this.isMenuClosing = false;
    this.isMenuVisible = false;
  }

  /**
   * Scrollt bei Bedarf zum Seitenanfang.
   */
  private scrollToTopIfRequired(
    scrollToTop: boolean
  ): void {
    if (scrollToTop) {
      this.scrollWindowTo(0);
    }
  }

  /**
   * Führt die gespeicherte Aktion aus.
   */
  private runAfterCloseAction(): void {
    const action = this.afterCloseAction;
    this.afterCloseAction = undefined;
    action?.();
  }

  /**
   * Sperrt das Scrollen der Seite.
   */
  private lockBodyScroll(): void {
    this.saveScrollPosition();
    this.addScrollLockClasses();
    this.applyFixedBodyStyles();
  }

  /**
   * Speichert die aktuelle Scrollposition.
   */
  private saveScrollPosition(): void {
    this.savedScrollPosition = window.scrollY
      || document.documentElement.scrollTop
      || 0;
  }

  /**
   * Fügt die Klassen der Scrollsperre hinzu.
   */
  private addScrollLockClasses(): void {
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll', 'menu-open');
  }

  /**
   * Fixiert den Body an der aktuellen Position.
   */
  private applyFixedBodyStyles(): void {
    const style = document.body.style;
    style.position = 'fixed';
    style.top = `-${this.savedScrollPosition}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';
    style.overflow = 'hidden';
  }

  /**
   * Entfernt die Scrollsperre.
   */
  private unlockBodyScroll(
    restorePosition: boolean = true
  ): void {
    this.removeScrollLockClasses();
    this.clearFixedBodyStyles();

    if (restorePosition) {
      this.scrollWindowTo(this.savedScrollPosition);
    }
  }

  /**
   * Entfernt die Klassen der Scrollsperre.
   */
  private removeScrollLockClasses(): void {
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll', 'menu-open');
  }

  /**
   * Entfernt die Inline-Styles der Scrollsperre.
   */
  private clearFixedBodyStyles(): void {
    const style = document.body.style;
    style.position = '';
    style.top = '';
    style.left = '';
    style.right = '';
    style.width = '';
    style.overflow = '';
  }

  /**
   * Scrollt das Fenster ohne Animation.
   */
  private scrollWindowTo(
    top: number
  ): void {
    window.scrollTo({
      top,
      left: 0,
      behavior: 'auto'
    });
  }

  /**
   * Bricht beide offenen Animation-Frames ab.
   */
  private clearOpenAnimationFrames(): void {
    this.openAnimationFrame = this.cancelAnimationFrame(
      this.openAnimationFrame
    );

    this.secondOpenAnimationFrame = this.cancelAnimationFrame(
      this.secondOpenAnimationFrame
    );
  }

  /**
   * Bricht einen Animation-Frame ab.
   */
  private cancelAnimationFrame(
    frameId?: number
  ): undefined {
    if (frameId !== undefined) {
      window.cancelAnimationFrame(frameId);
    }

    return undefined;
  }

  /**
   * Löscht den Timer der Schließanimation.
   */
  private clearMenuCloseTimer(): void {
    if (this.menuCloseTimer === undefined) {
      return;
    }

    window.clearTimeout(this.menuCloseTimer);
    this.menuCloseTimer = undefined;
  }

  /**
   * Bereinigt ein noch geöffnetes Menü.
   */
  private cleanUpOpenMenu(): void {
    if (!this.isMenuActive()) {
      return;
    }

    this.resetMenuState();
    this.resetAfterCloseAction();
    this.menuOpenChange.emit(false);
    this.unlockBodyScroll();
  }

  /**
   * Schließt das Menü sofort ohne Animation.
   */
  private closeMenuImmediately(): void {
    this.clearMenuAnimations();
    this.resetMenuState();
    this.resetAfterCloseAction();
    this.menuOpenChange.emit(false);
    this.unlockBodyScroll();
  }

  /**
   * Prüft, ob die Desktop-Navigation aktiv ist.
   */
  private isDesktop(): boolean {
    return window.innerWidth > 900;
  }

  /**
   * Schließt das Menü über die Escape-Taste.
   */
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isMenuOpen && !this.isMenuClosing) {
      this.closeMenu(false);
    }
  }

  /**
   * Schließt das Menü beim Wechsel zur Desktop-Ansicht.
   */
  @HostListener('window:resize')
  onResize(): void {
    if (this.isDesktop() && this.isMenuActive()) {
      this.closeMenuImmediately();
    }
  }

  /**
   * Verarbeitet einen Klick auf das Logo.
   */
  onLogoClick(
    event: MouseEvent
  ): void {
    if (this.isMenuActive()) {
      this.handleLogoClickWithOpenMenu(event);
      return;
    }

    this.handleLogoNavigation(event);
  }

  /**
   * Schließt das Menü vor der Logo-Navigation.
   */
  private handleLogoClickWithOpenMenu(
    event: MouseEvent
  ): void {
    this.preventNavigationEvent(event);
    this.closeMenu(false, () => this.handleLogoNavigation());
  }

  /**
   * Führt die passende Logo-Navigation aus.
   */
  private handleLogoNavigation(
    event?: MouseEvent
  ): void {
    if (this.variant === 'overlay') {
      this.handleOverlayLogoNavigation(event);
      return;
    }

    this.handleDefaultLogoNavigation();
  }

  /**
   * Meldet in der Overlay-Ansicht die Top-Navigation.
   */
  private handleOverlayLogoNavigation(
    event?: MouseEvent
  ): void {
    event?.preventDefault();
    this.navClick.emit('top');
  }

  /**
   * Navigiert zur Landingpage oder scrollt nach oben.
   */
  private handleDefaultLogoNavigation(): void {
    if (!this.isLandingPageUrl(this.router.url)) {
      void this.router.navigate(['/']);
      return;
    }

    this.scrollLandingPageToTop();
  }

  /**
   * Scrollt weich zum Anfang der Landingpage.
   */
  private scrollLandingPageToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}