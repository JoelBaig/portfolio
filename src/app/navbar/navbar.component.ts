// import { CommonModule, NgClass } from '@angular/common';
// import { Component, HostListener, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { TranslateModule, TranslateService, LangChangeEvent } from '@ngx-translate/core';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [CommonModule, NgClass, TranslateModule, RouterModule],
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.scss']
// })
// export class NavbarComponent implements OnInit, OnDestroy {
//   @Output() navClick = new EventEmitter<void>();
//   @Input() variant: 'default' | 'overlay' = 'default';

//   activeSection: string | null = null;
//   selectedLanguage: 'en' | 'de' = 'en';
//   dotClass = '';

//   private langSub?: Subscription;

//   constructor(private translate: TranslateService) { }

//   ngOnInit() {
//     this.selectedLanguage = (this.translate.currentLang as 'en' | 'de') ?? 'en';
//     this.setDotPositionInstant(this.selectedLanguage);

//     this.langSub = this.translate.onLangChange.subscribe((e: LangChangeEvent) => {
//       const lang = (e.lang as 'en' | 'de') ?? 'en';
//       this.selectedLanguage = lang;
//       this.setDotPositionInstant(lang);
//     });
//   }

//   ngOnDestroy() {
//     this.langSub?.unsubscribe();
//   }

//   emitNavClick() {
//     this.navClick.emit();
//   }

//   selectLanguage(lang: 'en' | 'de') {
//     if (lang === this.selectedLanguage) return;

//     this.dotClass = lang === 'de' ? 'dot-animate-right' : 'dot-animate-left';
//     this.selectedLanguage = lang;

//     if (this.translate.currentLang !== lang) {
//       this.translate.use(lang);
//     }
//   }

//   private setDotPositionInstant(lang: 'en' | 'de') {
//     this.dotClass = lang === 'de' ? 'dot-right' : 'dot-left';
//   }

//   @HostListener('window:scroll', [])
//   onScroll() {
//     const sections = ['about-me', 'skills', 'projects', 'contact'];
//     for (const id of sections) {
//       const el = document.getElementById(id);
//       if (!el) continue;
//       const rect = el.getBoundingClientRect();
//       if (rect.top <= 150 && rect.bottom >= 150) {
//         this.activeSection = id;
//         return;
//       }
//     }
//     this.activeSection = null;
//   }

//   isMenuOpen = false;

//   toggleMenu() {
//     this.isMenuOpen = !this.isMenuOpen;
//     document.documentElement.classList.toggle('no-scroll', this.isMenuOpen);
//     document.body.classList.toggle('no-scroll', this.isMenuOpen);
//     document.body.classList.toggle('menu-open', this.isMenuOpen);
//     document.getElementById('mainContent')?.classList.add('d-none');
//     document.getElementById('menuBar')?.classList.add('d-none');
//   }

//   closeMenu() {
//     this.isMenuOpen = false;
//     document.documentElement.classList.remove('no-scroll');
//     document.body.classList.remove('no-scroll');
//     document.getElementById('mainContent')?.classList.remove('d-none');
//     document.getElementById('menuBar')?.classList.remove('d-none');
//   }

//   @HostListener('document:keydown.escape')
//   onEsc() {
//     if (this.isMenuOpen) this.closeMenu();
//   }

//   @HostListener('window:resize')
//   onResize() {
//     if (window.innerWidth > 900 && this.isMenuOpen) this.closeMenu();
//   }

//   // scrollToTop() {
//   //     window.scrollTo({ top: 0, behavior: 'smooth' });
//   // }
// }


// navbar.component.ts
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
    RouterModule],
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

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.selectedLanguage = (this.translate.currentLang as 'en' | 'de') ?? 'en';
    this.setDotPositionInstant(this.selectedLanguage);

    this.langSub = this.translate.onLangChange.subscribe((e: LangChangeEvent) => {
      const lang = (e.lang as 'en' | 'de') ?? 'en';
      this.selectedLanguage = lang;
      this.setDotPositionInstant(lang);
    });
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
    if (this.isMenuOpen) this.unlockBodyScrollStayOnTop();
  }

  emitNavClick() {
    this.navClick.emit();
  }

  selectLanguage(lang: 'en' | 'de') {
    if (lang === this.selectedLanguage) return;

    this.dotClass = lang === 'de' ? 'dot-animate-right' : 'dot-animate-left';
    this.selectedLanguage = lang;

    if (this.translate.currentLang !== lang) {
      this.translate.use(lang);
    }
  }

  private setDotPositionInstant(lang: 'en' | 'de') {
    this.dotClass = lang === 'de' ? 'dot-right' : 'dot-left';
  }

  private lockAfterScrollTimer?: number;

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
      return;
    }

    this.isMenuOpen = true;

    // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    this.lockAfterScrollTimer = window.setTimeout(() => {
      this.lockBodyScrollAtTop();
    }, 450);

    document.getElementById('mainContent')?.classList.add('d-none');
    document.getElementById('menuBars')?.classList.add('d-none');
  }

  closeMenu() {
    this.isMenuOpen = false;

    if (this.lockAfterScrollTimer) {
      window.clearTimeout(this.lockAfterScrollTimer);
      this.lockAfterScrollTimer = undefined;
    }

    this.unlockBodyScrollStayOnTop();

    document.getElementById('mainContent')?.classList.remove('d-none');
    document.getElementById('menuBars')?.classList.remove('d-none');
  }

  private lockBodyScrollAtTop() {
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll', 'menu-open');
    document.body.style.position = 'fixed';
    document.body.style.top = '0px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  private unlockBodyScrollStayOnTop() {
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
  onEsc() {
    if (this.isMenuOpen) this.closeMenu();
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 800 && this.isMenuOpen) this.closeMenu();
  }
}