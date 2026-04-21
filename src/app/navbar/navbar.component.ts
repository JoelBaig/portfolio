import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService, LangChangeEvent } from '@ngx-translate/core';
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
  @Output() navClick = new EventEmitter<void>();
  @Input() variant: 'default' | 'overlay' = 'default';

  activeSection: string | null = null;
  selectedLanguage: 'en' | 'de' = 'en';
  dotClass = '';
  isMenuOpen = false;

  private langSub?: Subscription;
  private lockAfterScrollTimer?: number;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.selectedLanguage = (this.translate.currentLang as 'en' | 'de') ?? 'en';
    this.setDotPositionInstant(this.selectedLanguage);

    this.langSub = this.translate.onLangChange.subscribe((e: LangChangeEvent) => {
      const lang = (e.lang as 'en' | 'de') ?? 'en';
      this.selectedLanguage = lang;
      this.setDotPositionInstant(lang);
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();

    if (this.lockAfterScrollTimer) {
      window.clearTimeout(this.lockAfterScrollTimer);
    }

    if (this.isMenuOpen) {
      this.unlockBodyScrollStayOnTop();
    }
  }

  emitNavClick(): void {
    this.navClick.emit();
  }

  selectLanguage(lang: 'en' | 'de'): void {
    if (lang === this.selectedLanguage) return;

    this.dotClass = lang === 'de' ? 'dot-animate-right' : 'dot-animate-left';
    this.selectedLanguage = lang;

    if (this.translate.currentLang !== lang) {
      this.translate.use(lang);
    }
  }

  private setDotPositionInstant(lang: 'en' | 'de'): void {
    this.dotClass = lang === 'de' ? 'dot-right' : 'dot-left';
  }

  toggleMenu(): void {
    if (window.innerWidth > 900) return;

    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.lockAfterScrollTimer = window.setTimeout(() => {
        this.lockBodyScrollAtTop();
      }, 450);

      document.getElementById('mainContent')?.classList.add('d-none');
    } else {
      if (this.lockAfterScrollTimer) {
        window.clearTimeout(this.lockAfterScrollTimer);
        this.lockAfterScrollTimer = undefined;
      }

      this.unlockBodyScrollStayOnTop();
      document.getElementById('mainContent')?.classList.remove('d-none');
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;

    if (this.lockAfterScrollTimer) {
      window.clearTimeout(this.lockAfterScrollTimer);
      this.lockAfterScrollTimer = undefined;
    }

    this.unlockBodyScrollStayOnTop();
    document.getElementById('mainContent')?.classList.remove('d-none');
  }

  private lockBodyScrollAtTop(): void {
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll', 'menu-open');
    document.body.style.position = 'fixed';
    document.body.style.top = '0px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  private unlockBodyScrollStayOnTop(): void {
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll', 'menu-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 900 && this.isMenuOpen) {
      this.closeMenu();
    }
  }
}