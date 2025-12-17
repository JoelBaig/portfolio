import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() navClick = new EventEmitter<void>();

  isHovered = {
    about: false,
    skills: false,
    projects: false,
    contact: false
  };
  activeSection: string | null = null;
  selectedLanguage: 'en' | 'de' = 'en';
  dotAnimationClass = '';

  @Input() variant: 'default' | 'overlay' = 'default';

  emitNavClick() {
    this.navClick.emit();
  }

  selectLanguage(lang: 'en' | 'de') {
    if (lang === this.selectedLanguage) return;

    this.dotAnimationClass =
      lang === 'de' ? 'dot-animate-right' : 'dot-animate-left';

    this.selectedLanguage = lang;
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
    let found = false;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          this.activeSection = id;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      this.activeSection = null;
    }
  }

  triggerLinkHoverEffect(link: keyof typeof this.isHovered) {
    this.isHovered[link] = true;
  }

  removeLinkHoverEffect(link: keyof typeof this.isHovered) {
    this.isHovered[link] = false;
  }
}