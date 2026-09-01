import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

/**
 * Root application component.
 *
 * Handles:
 * - application language
 * - section/anchor navigation
 * - removal of URL fragments
 * - scroll reset on initial page load
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
export class AppComponent {
  private translate = inject(TranslateService);
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);
  private platformId = inject(PLATFORM_ID);

  /**
   * True only when Angular is running inside the browser.
   *
   * This is important because the application also uses SSR
   * where objects like window and history do not exist.
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
   * Sets the default application language.
   * Uses the previously saved language if available.
   */
  private initLanguage(): void {
    this.translate.setDefaultLang('en');
    if (!this.isBrowser) {
      return;
    }
    const savedLanguage = localStorage.getItem('lang');
    const language = savedLanguage === 'de' || savedLanguage === 'en'
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
        if (!this.isBrowser) {
          return;
        }
        /**
         * Ignore anchor scrolling on the initial page load.
         */
        if (this.initialNavigation) {
          this.initialNavigation = false;
          this.removeFragmentFromBrowserUrl();
          requestAnimationFrame(() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'auto'
            });
          });
          return;
        }
        this.scrollToCurrentFragment();
      });
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
      this.viewportScroller.scrollToAnchor(
        fragment
      );

      /**
       * Remove #skills / #projects / etc.
       * from the visible browser URL afterwards.
       *
       * The user stays on the section,
       * but the URL remains clean.
       */
      this.removeFragmentFromBrowserUrl();
    });
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