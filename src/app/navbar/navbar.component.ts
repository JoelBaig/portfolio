import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  selectedLanguage: 'en' | 'de' = 'en';
  dotAnimationClass = '';

  isHovered = {
    about: false,
    skills: false,
    projects: false,
    contact: false
  };

  selectLanguage(lang: 'en' | 'de') {
    if (lang === this.selectedLanguage) return;

    this.dotAnimationClass =
      lang === 'de' ? 'dot-animate-right' : 'dot-animate-left';

    this.selectedLanguage = lang;
  }

  triggerLinkHoverEffect(link: keyof typeof this.isHovered) {
    this.isHovered[link] = true;
  }

  removeLinkHoverEffect(link: keyof typeof this.isHovered) {
    this.isHovered[link] = false;
  }
}
