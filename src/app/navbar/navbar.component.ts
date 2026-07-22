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
   * Creates the navbar component and injects the required services.
   */
  constructor(
    private translate: TranslateService,
    private router: Router
  ) { }

  /**
   * Initializes the active language and router subscriptions.
   */
  ngOnInit(): void {
    this.initSelectedLanguage();
    this.subscribeToLanguageChanges();
    this.subscribeToRouterEvents();
  }

  /**
   * Removes subscriptions, timers and active menu states.
   */
  ngOnDestroy(): void {
    this.unsubscribeFromServices();
    this.clearOpenAnimationFrames();
    this.clearMenuCloseTimer();
    this.cleanUpOpenMenu();
  }

  /**
   * Unsubscribes from all active service subscriptions.
   */
  private unsubscribeFromServices(): void {
    this.langSub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }

  /**
   * Initializes the currently selected language.
   */
  private initSelectedLanguage(): void {
    this.selectedLanguage = this.getCurrentLanguage();
    this.setDotPositionInstant(this.selectedLanguage);
  }

  /**
   * Subscribes to changes of the active application language.
   */
  private subscribeToLanguageChanges(): void {
    this.langSub = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => this.handleLanguageChange(event)
    );
  }

  /**
   * Subscribes to completed router navigation events.
   */
  private subscribeToRouterEvents(): void {
    this.routerSub = this.router.events
      .pipe(filter(this.isNavigationEnd))
      .subscribe(() => this.handleNavigationEnd());
  }

  /**
   * Checks whether a router event is a NavigationEnd event.
   *
   * @param event The router event to check.
   * @returns True if the event is a NavigationEnd instance.
   */
  private isNavigationEnd(
    event: unknown
  ): event is NavigationEnd {
    return event instanceof NavigationEnd;
  }

  /**
   * Scrolls to the current URL fragment after navigation.
   */
  private handleNavigationEnd(): void {
    const fragment = this.getFragmentFromUrl(this.router.url);

    if (fragment) {
      this.scrollToFragment(fragment);
    }
  }

  /**
   * Applies a changed application language.
   *
   * @param event The emitted language change event.
   */
  private handleLanguageChange(
    event: LangChangeEvent
  ): void {
    const language = this.getLangFromEvent(event);
    this.selectedLanguage = language;
    this.setDotPositionInstant(language);
  }

  /**
   * Resolves a supported language from a language change event.
   *
   * @param event The emitted language change event.
   * @returns The resolved supported language.
   */
  private getLangFromEvent(
    event: LangChangeEvent
  ): Language {
    return event.lang === 'de' ? 'de' : 'en';
  }

  /**
   * Returns the currently active application language.
   *
   * @returns The currently active supported language.
   */
  private getCurrentLanguage(): Language {
    return this.translate.currentLang === 'de' ? 'de' : 'en';
  }

  /**
   * Handles a click on a navigation item.
   *
   * @param fragment The target section fragment.
   * @param event The optional triggering event.
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
   * Checks whether the mobile menu is open or closing.
   *
   * @returns True if the mobile menu is active.
   */
  private isMenuActive(): boolean {
    return this.isMenuOpen || this.isMenuClosing;
  }

  /**
   * Closes the mobile menu and navigates to the target fragment afterwards.
   *
   * @param fragment The target section fragment.
   * @param event The optional triggering event.
   */
  private handleMobileNavClick(
    fragment: string,
    event?: Event
  ): void {
    this.preventNavigationEvent(event);
    this.closeMenu(false, () => this.navigateToFragment(fragment));
  }

  /**
   * Handles navigation while the mobile menu is closed.
   *
   * @param fragment The target section fragment.
   * @param event The optional triggering event.
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
   * Prevents the default behavior and propagation of an event.
   *
   * @param event The optional event to prevent.
   */
  private preventNavigationEvent(
    event?: Event
  ): void {
    event?.preventDefault();
    event?.stopPropagation();
  }

  /**
   * Navigates according to the current navbar variant.
   *
   * @param fragment The target section fragment.
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
   * Navigates within the landing page or back to it from a subpage.
   *
   * @param fragment The target section fragment.
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
   * Updates the fragment while remaining on the landing page.
   *
   * @param fragment The target section fragment.
   */
  private navigateWithinLandingPage(
    fragment: string
  ): void {
    this.updateUrlFragment(fragment);
  }

  /**
   * Navigates from a subpage to the landing page.
   *
   * @param fragment The target section fragment.
   */
  private navigateToLandingPage(
    fragment: string
  ): void {
    void this.router.navigate(['/'], { fragment });
  }

  /**
   * Checks whether a URL points to the landing page.
   *
   * @param url The URL to check.
   * @returns True if the URL belongs to the landing page.
   */
  private isLandingPageUrl(
    url: string
  ): boolean {
    const path = this.getUrlPath(url);
    return path === '/' || path === '';
  }

  /**
   * Removes the fragment and query parameters from a URL.
   *
   * @param url The URL to normalize.
   * @returns The normalized URL path.
   */
  private getUrlPath(
    url: string
  ): string {
    return url.split('#')[0].split('?')[0];
  }

  /**
   * Updates the fragment of the current URL.
   *
   * @param fragment The target section fragment.
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
   * Schedules scrolling to the requested fragment.
   *
   * @param fragment The target section fragment.
   */
  private scrollToFragment(
    fragment: string
  ): void {
    window.requestAnimationFrame(
      () => this.scheduleFragmentScroll(fragment)
    );
  }

  /**
   * Waits for another animation frame before scrolling.
   *
   * @param fragment The target section fragment.
   */
  private scheduleFragmentScroll(
    fragment: string
  ): void {
    window.requestAnimationFrame(
      () => this.performFragmentScroll(fragment)
    );
  }

  /**
   * Scrolls to the element matching the requested fragment.
   *
   * @param fragment The target section fragment.
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
   * Extracts the fragment from a URL.
   *
   * @param url The URL containing the fragment.
   * @returns The fragment or null when none exists.
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
   * Activates the selected application language.
   *
   * @param language The language to activate.
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
   * Updates the language and language switch state.
   *
   * @param language The language to activate.
   */
  private applyLanguageSelection(
    language: Language
  ): void {
    this.animateDotToLanguage(language);
    this.selectedLanguage = language;
    this.useLanguage(language);
  }

  /**
   * Starts the language switch dot animation.
   *
   * @param language The selected language.
   */
  private animateDotToLanguage(
    language: Language
  ): void {
    this.dotClass = language === 'de'
      ? 'dot-animate-right'
      : 'dot-animate-left';
  }

  /**
   * Activates a language through the translation service.
   *
   * @param language The language to activate.
   */
  private useLanguage(
    language: Language
  ): void {
    if (this.translate.currentLang !== language) {
      this.translate.use(language);
    }
  }

  /**
   * Positions the language switch dot without animation.
   *
   * @param language The selected language.
   */
  private setDotPositionInstant(
    language: Language
  ): void {
    this.dotClass = language === 'de'
      ? 'dot-right'
      : 'dot-left';
  }

  /**
   * Opens or closes the mobile menu.
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
   * Checks whether the mobile menu can currently be toggled.
   *
   * @returns True if the menu may be toggled.
   */
  private canToggleMenu(): boolean {
    return !this.isDesktop() && !this.isMenuClosing;
  }

  /**
   * Opens the mobile menu.
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
   * Clears all active menu timers and animation frames.
   */
  private clearMenuAnimations(): void {
    this.clearMenuCloseTimer();
    this.clearOpenAnimationFrames();
  }

  /**
   * Removes the stored action that should run after closing.
   */
  private resetAfterCloseAction(): void {
    this.afterCloseAction = undefined;
  }

  /**
   * Sets the initial state for the opening animation.
   */
  private setOpeningMenuState(): void {
    this.isMenuOpen = true;
    this.isMenuClosing = false;
    this.isMenuVisible = false;
  }

  /**
   * Schedules the start of the mobile menu opening animation.
   */
  private scheduleMenuOpening(): void {
    this.openAnimationFrame = window.requestAnimationFrame(
      () => this.scheduleMenuVisibility()
    );
  }

  /**
   * Waits for another animation frame before showing the menu.
   */
  private scheduleMenuVisibility(): void {
    this.secondOpenAnimationFrame = window.requestAnimationFrame(
      () => this.showMenu()
    );
  }

  /**
   * Makes the mobile menu visible.
   */
  private showMenu(): void {
    this.isMenuVisible = true;
  }

  /**
   * Starts closing the mobile menu.
   *
   * @param scrollToTop Whether the page should scroll to the top afterwards.
   * @param afterClose An optional action to run after closing.
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
   * Prepares the mobile menu closing animation.
   *
   * @param scrollToTop Whether the page should scroll to the top afterwards.
   * @param afterClose An optional action to run after closing.
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
   * Sets the state required for the closing animation.
   */
  private setClosingMenuState(): void {
    this.isMenuClosing = true;
    this.isMenuVisible = false;
  }

  /**
   * Schedules the completion of the closing animation.
   *
   * @param scrollToTop Whether the page should scroll to the top afterwards.
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
   * Completes the mobile menu closing process.
   *
   * @param scrollToTop Whether the page should scroll to the top afterwards.
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
   * Resets all mobile menu states.
   */
  private resetMenuState(): void {
    this.isMenuOpen = false;
    this.isMenuClosing = false;
    this.isMenuVisible = false;
  }

  /**
   * Scrolls to the top of the page when requested.
   *
   * @param scrollToTop Whether the page should scroll to the top.
   */
  private scrollToTopIfRequired(
    scrollToTop: boolean
  ): void {
    if (scrollToTop) {
      this.scrollWindowTo(0);
    }
  }

  /**
   * Runs the stored action after the mobile menu has closed.
   */
  private runAfterCloseAction(): void {
    const action = this.afterCloseAction;
    this.afterCloseAction = undefined;
    action?.();
  }

  /**
   * Locks scrolling on the document body.
   */
  private lockBodyScroll(): void {
    this.saveScrollPosition();
    this.addScrollLockClasses();
    this.applyFixedBodyStyles();
  }

  /**
   * Saves the current vertical scroll position.
   */
  private saveScrollPosition(): void {
    this.savedScrollPosition = window.scrollY
      || document.documentElement.scrollTop
      || 0;
  }

  /**
   * Adds the classes required to lock document scrolling.
   */
  private addScrollLockClasses(): void {
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll', 'menu-open');
  }

  /**
   * Fixes the body at the current scroll position.
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
   * Removes the document scroll lock.
   *
   * @param restorePosition Whether the previous scroll position should be restored.
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
   * Removes the classes used to lock document scrolling.
   */
  private removeScrollLockClasses(): void {
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll', 'menu-open');
  }

  /**
   * Removes the inline styles used to fix the document body.
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
   * Scrolls the window without animation.
   *
   * @param top The target vertical scroll position.
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
   * Cancels both pending menu opening animation frames.
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
   * Cancels a pending animation frame.
   *
   * @param frameId The animation frame id to cancel.
   * @returns Undefined after the animation frame has been handled.
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
   * Clears the active mobile menu closing timer.
   */
  private clearMenuCloseTimer(): void {
    if (this.menuCloseTimer === undefined) {
      return;
    }

    window.clearTimeout(this.menuCloseTimer);
    this.menuCloseTimer = undefined;
  }

  /**
   * Cleans up an open or closing mobile menu.
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
   * Closes the mobile menu immediately without animation.
   */
  private closeMenuImmediately(): void {
    this.clearMenuAnimations();
    this.resetMenuState();
    this.resetAfterCloseAction();
    this.menuOpenChange.emit(false);
    this.unlockBodyScroll();
  }

  /**
   * Checks whether the desktop navigation layout is active.
   *
   * @returns True if the current viewport uses the desktop layout.
   */
  private isDesktop(): boolean {
    return window.innerWidth > 900;
  }

  /**
   * Closes the mobile menu when the Escape key is pressed.
   */
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isMenuOpen && !this.isMenuClosing) {
      this.closeMenu(false);
    }
  }

  /**
   * Closes the mobile menu when switching to the desktop layout.
   */
  @HostListener('window:resize')
  onResize(): void {
    if (this.isDesktop() && this.isMenuActive()) {
      this.closeMenuImmediately();
    }
  }

  /**
   * Handles a click on the navbar logo.
   *
   * @param event The triggering mouse event.
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
   * Closes the mobile menu before handling logo navigation.
   *
   * @param event The triggering mouse event.
   */
  private handleLogoClickWithOpenMenu(
    event: MouseEvent
  ): void {
    this.preventNavigationEvent(event);
    this.closeMenu(false, () => this.handleLogoNavigation());
  }

  /**
   * Performs the appropriate navigation for a logo click.
   *
   * @param event The optional triggering mouse event.
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
   * Emits navigation to the page top in the overlay variant.
   *
   * @param event The optional triggering mouse event.
   */
  private handleOverlayLogoNavigation(
    event?: MouseEvent
  ): void {
    event?.preventDefault();
    this.navClick.emit('top');
  }

  /**
   * Navigates to the landing page or scrolls it to the top.
   */
  private handleDefaultLogoNavigation(): void {
    if (!this.isLandingPageUrl(this.router.url)) {
      void this.router.navigate(['/']);
      return;
    }

    this.scrollLandingPageToTop();
  }

  /**
   * Smoothly scrolls to the top of the landing page.
   */
  private scrollLandingPageToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}