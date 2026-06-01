import { Component, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

/**
 * Root application component.
 * Initializes the application language and
 * handles automatic scrolling to URL fragments.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private translate = inject(TranslateService);
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);

  /**
   * Initializes application-wide settings and listeners.
   */
  constructor() {
    this.initLanguage();
    this.handleAnchorScrolling();
  }

  /**
   * Sets the default application language.
   */
  private initLanguage(): void {
    localStorage.removeItem('lang');
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  /**
   * Subscribes to router navigation events
   * and handles scrolling to anchor fragments.
   */
  private handleAnchorScrolling(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.scrollToCurrentFragment());
  }

  /**
   * Scrolls to the current URL fragment if one exists.
   */
  private scrollToCurrentFragment(): void {
    const fragment = this.router.parseUrl(this.router.url).fragment;

    if (!fragment) {
      return;
    }

    this.scrollToAnchorAfterRender(fragment);
  }

  /**
   * Scrolls to the specified anchor after the next render cycle.
   *
   * @param fragment The target anchor fragment.
   */
  private scrollToAnchorAfterRender(fragment: string): void {
    requestAnimationFrame(() => {
      this.viewportScroller.scrollToAnchor(fragment);
    });
  }
}