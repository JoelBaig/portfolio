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
  isMenuVisible = false;

  private readonly menuAnimationDuration = 600;

  private langSub?: Subscription;
  private routerSub?: Subscription;

  private menuCloseTimer?: number;
  private openAnimationFrame?: number;
  private secondOpenAnimationFrame?: number;

  private afterCloseAction?: () => void;

  private savedScrollPosition = 0;

  constructor(
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initSelectedLanguage();
    this.subscribeToLanguageChanges();
    this.subscribeToRouterEvents();
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.routerSub?.unsubscribe();

    this.clearOpenAnimationFrames();
    this.clearMenuCloseTimer();
    this.cleanUpOpenMenu();
  }

  private initSelectedLanguage(): void {
    this.selectedLanguage =
      this.getCurrentLanguage();

    this.setDotPositionInstant(
      this.selectedLanguage
    );
  }

  private subscribeToLanguageChanges(): void {
    this.langSub =
      this.translate.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.handleLanguageChange(event);
        }
      );
  }

  private subscribeToRouterEvents(): void {
    this.routerSub =
      this.router.events
        .pipe(
          filter(
            (event): event is NavigationEnd =>
              event instanceof NavigationEnd
          )
        )
        .subscribe(() => {
          const fragment =
            this.getFragmentFromUrl(
              this.router.url
            );

          if (!fragment) {
            return;
          }

          this.scrollToFragment(fragment);
        });
  }

  private handleLanguageChange(
    event: LangChangeEvent
  ): void {
    const lang =
      this.getLangFromEvent(event);

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
    if (
      this.isMenuOpen ||
      this.isMenuClosing
    ) {
      event?.preventDefault();
      event?.stopPropagation();

      this.closeMenu(
        false,
        () => {
          this.navigateToFragment(fragment);
        }
      );

      return;
    }

    if (this.variant === 'overlay') {
      event?.preventDefault();

      this.navClick.emit(fragment);

      return;
    }

    this.navClick.emit(fragment);
  }

  private navigateToFragment(
    fragment: string
  ): void {
    if (this.variant === 'overlay') {
      this.navClick.emit(fragment);

      return;
    }

    if (
      this.isLandingPageUrl(
        this.router.url
      )
    ) {
      this.updateUrlFragment(fragment);
      this.scrollToFragment(fragment);

      return;
    }

    void this.router.navigate(
      ['/'],
      {
        fragment
      }
    ).then(() => {
      this.scrollToFragment(fragment);
    });
  }

  private isLandingPageUrl(
    url: string
  ): boolean {
    const urlWithoutFragment =
      url.split('#')[0];

    const urlWithoutQuery =
      urlWithoutFragment.split('?')[0];

    return (
      urlWithoutQuery === '/' ||
      urlWithoutQuery === ''
    );
  }

  private updateUrlFragment(
    fragment: string
  ): void {
    void this.router.navigate(
      [],
      {
        fragment,
        replaceUrl: false
      }
    );
  }

  private scrollToFragment(
    fragment: string
  ): void {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const element =
          document.getElementById(fragment);

        if (!element) {
          return;
        }

        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }

  private getFragmentFromUrl(
    url: string
  ): string | null {
    const hashIndex =
      url.indexOf('#');

    if (hashIndex === -1) {
      return null;
    }

    const fragment =
      url.slice(hashIndex + 1);

    return fragment || null;
  }

  selectLanguage(
    lang: 'en' | 'de'
  ): void {
    if (
      lang === this.selectedLanguage
    ) {
      return;
    }

    this.animateDotToLanguage(lang);

    this.selectedLanguage = lang;

    this.useLanguage(lang);
  }

  private animateDotToLanguage(
    lang: 'en' | 'de'
  ): void {
    this.dotClass =
      lang === 'de'
        ? 'dot-animate-right'
        : 'dot-animate-left';
  }

  private useLanguage(
    lang: 'en' | 'de'
  ): void {
    if (
      this.translate.currentLang !== lang
    ) {
      this.translate.use(lang);
    }
  }

  private setDotPositionInstant(
    lang: 'en' | 'de'
  ): void {
    this.dotClass =
      lang === 'de'
        ? 'dot-right'
        : 'dot-left';
  }

  toggleMenu(): void {
    if (
      this.isDesktop() ||
      this.isMenuClosing
    ) {
      return;
    }

    if (this.isMenuOpen) {
      this.closeMenu(false);

      return;
    }

    this.openMenu();
  }

  private openMenu(): void {
    this.clearMenuCloseTimer();
    this.clearOpenAnimationFrames();

    this.afterCloseAction = undefined;

    this.isMenuOpen = true;
    this.isMenuClosing = false;
    this.isMenuVisible = false;

    this.menuOpenChange.emit(true);

    this.lockBodyScroll();

    this.openAnimationFrame =
      window.requestAnimationFrame(() => {
        this.secondOpenAnimationFrame =
          window.requestAnimationFrame(() => {
            this.isMenuVisible = true;
          });
      });
  }

  closeMenu(
    scrollToTop: boolean = false,
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

    this.clearOpenAnimationFrames();
    this.clearMenuCloseTimer();

    this.isMenuClosing = true;
    this.isMenuVisible = false;

    this.menuOpenChange.emit(false);

    this.menuCloseTimer =
      window.setTimeout(() => {
        this.finishClosingMenu(
          scrollToTop
        );
      }, this.menuAnimationDuration);
  }

  private finishClosingMenu(
    scrollToTop: boolean
  ): void {
    this.isMenuOpen = false;
    this.isMenuClosing = false;
    this.isMenuVisible = false;

    this.menuCloseTimer = undefined;

    this.unlockBodyScroll();

    if (scrollToTop) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }

    const action =
      this.afterCloseAction;

    this.afterCloseAction = undefined;

    action?.();
  }

  private lockBodyScroll(): void {
    this.savedScrollPosition =
      window.scrollY ||
      document.documentElement.scrollTop ||
      0;

    document.documentElement.classList.add(
      'no-scroll'
    );

    document.body.classList.add(
      'no-scroll',
      'menu-open'
    );

    document.body.style.position = 'fixed';

    document.body.style.top =
      `-${this.savedScrollPosition}px`;

    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    document.documentElement.classList.remove(
      'no-scroll'
    );

    document.body.classList.remove(
      'no-scroll',
      'menu-open'
    );

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';

    window.scrollTo({
      top: this.savedScrollPosition,
      left: 0,
      behavior: 'auto'
    });
  }

  private clearOpenAnimationFrames(): void {
    if (
      this.openAnimationFrame !== undefined
    ) {
      window.cancelAnimationFrame(
        this.openAnimationFrame
      );

      this.openAnimationFrame = undefined;
    }

    if (
      this.secondOpenAnimationFrame !== undefined
    ) {
      window.cancelAnimationFrame(
        this.secondOpenAnimationFrame
      );

      this.secondOpenAnimationFrame = undefined;
    }
  }

  private clearMenuCloseTimer(): void {
    if (
      this.menuCloseTimer === undefined
    ) {
      return;
    }

    window.clearTimeout(
      this.menuCloseTimer
    );

    this.menuCloseTimer = undefined;
  }

  private cleanUpOpenMenu(): void {
    if (
      !this.isMenuOpen &&
      !this.isMenuClosing
    ) {
      return;
    }

    this.isMenuOpen = false;
    this.isMenuClosing = false;
    this.isMenuVisible = false;

    this.afterCloseAction = undefined;

    this.menuOpenChange.emit(false);

    this.unlockBodyScroll();
  }

  private closeMenuImmediately(): void {
    this.clearOpenAnimationFrames();
    this.clearMenuCloseTimer();

    this.isMenuOpen = false;
    this.isMenuClosing = false;
    this.isMenuVisible = false;

    this.afterCloseAction = undefined;

    this.menuOpenChange.emit(false);

    this.unlockBodyScroll();
  }

  private isDesktop(): boolean {
    return window.innerWidth > 900;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (
      this.isMenuOpen &&
      !this.isMenuClosing
    ) {
      this.closeMenu(false);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (
      this.isDesktop() &&
      (
        this.isMenuOpen ||
        this.isMenuClosing
      )
    ) {
      this.closeMenuImmediately();
    }
  }

  onLogoClick(
    event: MouseEvent
  ): void {
    if (
      this.isMenuOpen ||
      this.isMenuClosing
    ) {
      event.preventDefault();
      event.stopPropagation();

      this.closeMenu(
        false,
        () => {
          this.handleLogoNavigation();
        }
      );

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

    if (
      !this.isLandingPageUrl(
        this.router.url
      )
    ) {
      void this.router.navigate(['/']);

      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}