import { AfterViewInit, Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

/**
 * Defines the AOS functions used by the application.
 */
interface AosInstance {
  init(options?: Record<string, unknown>): void;
  refresh(): void;
}

/**
 * Root application component.
 *
 * Handles:
 * - application language
 * - section/anchor navigation
 * - removal of URL fragments
 * - scroll reset on initial page load
 * - Animate On Scroll (AOS) animations
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  private translate = inject(TranslateService);
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);
  private platformId = inject(PLATFORM_ID);

  /**
   * Stores the loaded AOS instance.
   *
   * AOS is loaded only inside the browser because the application
   * also uses server-side rendering (SSR).
   */
  private aos: AosInstance | null = null;

  /**
   * True only when Angular is running inside the browser.
   *
   * This is important because the application also uses SSR
   * where objects like window, history and document do not exist.
   */
  private readonly isBrowser = isPlatformBrowser(
    this.platformId
  );

  /**
   * Used to detect the first Angular navigation.
   *
   * On the first page load we do NOT want to scroll to
   * an existing URL fragment such as #skills.
   */
  private initialNavigation = true;

  constructor() {
    this.initLanguage();

    if (this.isBrowser) {

      /**
       * Prevent the browser itself from restoring
       * the previous scroll position after a reload.
       */
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      /**
       * Remove an existing fragment immediately.
       *
       * Example:
       *
       * joelbaig.com/#skills
       *
       * becomes:
       *
       * joelbaig.com/
       */
      this.removeFragmentFromBrowserUrl();

      /**
       * Always begin at the top when the application
       * is loaded/reloaded.
       */
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }

    this.handleAnchorScrolling();
  }

  /**
   * Initializes browser-specific functionality after Angular
   * has rendered the application's initial view.
   *
   * AOS is initialized here because its animations depend on
   * rendered DOM elements and must never run during SSR.
   */
  ngAfterViewInit(): void {
    this.initAos();
  }

  /**
   * Dynamically loads and initializes Animate On Scroll.
   */
  private async initAos(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }

    await this.loadAos();
    this.startAos();
    this.scheduleAosRefresh();
  }

  /**
   * Loads the AOS default export dynamically.
   */
  private async loadAos(): Promise<void> {
    const aosModule = await import('aos');

    this.aos = aosModule.default as AosInstance;
  }

  /**
   * Initializes AOS with the global animation settings.
   */
  private startAos(): void {
    this.aos?.init({
      duration: 700,
      once: true,
      easing: 'ease-out',
      offset: 250
    });
  }

  /**
   * Schedules an AOS refresh for the next rendering frame.
   */
  private scheduleAosRefresh(): void {
    requestAnimationFrame(() => {
      this.aos?.refresh();
    });
  }

  /**
   * Refreshes AOS after Angular navigation or DOM changes.
   *
   * This makes sure that newly rendered or repositioned elements
   * are detected correctly by AOS and receive their animations.
   */
  private refreshAos(): void {
    if (!this.isBrowser || !this.aos) {
      return;
    }

    this.scheduleAosRefresh();
  }

  /**
   * Sets the default application language.
   * Uses the previously saved language if available.
   */
  private initLanguage(): void {
    this.translate.setDefaultLang('en');

    if (!this.isBrowser) {
      return;
    }

    const savedLanguage = localStorage.getItem('lang');

    const language =
      savedLanguage === 'de' || savedLanguage === 'en'
        ? savedLanguage
        : 'en';

    this.translate.use(language);
  }

  /**
   * Watches Angular navigation events.
   *
   * Initial navigation:
   * - stays at the top
   * - ignores old URL fragments
   *
   * Later navigation:
   * - scrolls to the requested section
   * - removes the fragment afterwards
   * - refreshes AOS positions
   */
  private handleAnchorScrolling(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.handleNavigationEnd();
      });
  }

  /**
   * Handles a completed Angular navigation.
   */
  private handleNavigationEnd(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.initialNavigation) {
      this.handleInitialNavigation();
      return;
    }

    this.handleLaterNavigation();
  }

  /**
   * Handles the application's initial navigation.
   */
  private handleInitialNavigation(): void {
    this.initialNavigation = false;
    this.removeFragmentFromBrowserUrl();

    requestAnimationFrame(() => {
      this.resetInitialScroll();
    });
  }

  /**
   * Resets the initial scroll position and refreshes AOS.
   */
  private resetInitialScroll(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });

    this.refreshAos();
  }

  /**
   * Handles all navigations after the initial page load.
   */
  private handleLaterNavigation(): void {
    this.scrollToCurrentFragment();
    this.refreshAos();
  }

  /**
   * Gets the current Angular URL fragment.
   *
   * Example:
   *
   * /#skills
   *
   * fragment = "skills"
   */
  private scrollToCurrentFragment(): void {
    const fragment =
      this.router.parseUrl(
        this.router.url
      ).fragment;

    if (!fragment) {
      return;
    }

    this.scrollToAnchorAfterRender(fragment);
  }

  /**
   * Scrolls to a section after Angular has rendered it.
   */
  private scrollToAnchorAfterRender(
    fragment: string
  ): void {
    requestAnimationFrame(() => {
      this.scrollToAnchor(fragment);
    });
  }

  /**
   * Scrolls to an anchor and cleans the browser URL.
   */
  private scrollToAnchor(fragment: string): void {
    this.viewportScroller.scrollToAnchor(
      fragment
    );

    this.removeFragmentFromBrowserUrl();
    this.refreshAos();
  }

  /**
   * Removes the hash/fragment from the browser address bar
   * without reloading the page.
   *
   * Example:
   *
   * https://joelbaig.com/#skills
   *
   * becomes:
   *
   * https://joelbaig.com/
   */
  private removeFragmentFromBrowserUrl(): void {
    if (!this.isBrowser) {
      return;
    }

    if (!window.location.hash) {
      return;
    }

    this.replaceUrlWithoutFragment();
  }

  /**
   * Replaces the current URL without its fragment.
   */
  private replaceUrlWithoutFragment(): void {
    const cleanUrl =
      window.location.pathname +
      window.location.search;

    history.replaceState(
      history.state,
      '',
      cleanUrl
    );
  }
}