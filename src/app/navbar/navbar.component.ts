import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    TranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() navClick = new EventEmitter<void>();

  activeSection: string | null = null;
  selectedLanguage: 'en' | 'de' = 'en';
  dotAnimationClass = '';

  @Input() variant: 'default' | 'overlay' = 'default';

  constructor(private translate: TranslateService) {
    const saved = (localStorage.getItem('lang') as 'en' | 'de') || 'de';
    this.selectedLanguage = saved;
    this.translate.use(saved);
  }

  emitNavClick() {
    this.navClick.emit();
  }

  selectLanguage(lang: 'en' | 'de') {
    if (lang === this.selectedLanguage) return;

    this.dotAnimationClass = lang === 'de' ? 'dot-animate-right' : 'dot-animate-left';
    this.selectedLanguage = lang;
    this.translate.use(lang);
  }

  ngOnInit() {
    this.selectedLanguage = 'en';
    this.dotAnimationClass = '';
    this.translate.use('en');
  }

  scrollToSection(sectionId: string) {
    this.navClick.emit();

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection = sectionId;
    }
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