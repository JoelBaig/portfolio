import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgClass, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() navClick = new EventEmitter<void>();
  @Input() variant: 'default' | 'overlay' = 'default';

  activeSection: string | null = null;
  selectedLanguage: 'en' | 'de' = 'en';
  dotAnimationClass = '';

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
  }

  selectLanguage(lang: 'en' | 'de') {
    if (lang === this.selectedLanguage) return;

    this.dotAnimationClass = lang === 'de' ? 'dot-animate-right' : 'dot-animate-left';
    this.selectedLanguage = lang;

    if (this.translate.currentLang !== lang) {
      this.translate.use(lang);
    }
  }

  private setDotPositionInstant(lang: 'en' | 'de') {
    this.dotAnimationClass = lang === 'de' ? 'dot-right' : 'dot-left';
  }

  emitNavClick() {
    this.navClick.emit();
  }

  scrollToSection(sectionId: string) {
    this.navClick.emit();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeSection = sectionId;
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const sections = ['about-me', 'skills', 'projects', 'contact'];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        this.activeSection = id;
        return;
      }
    }
    this.activeSection = null;
  }
}