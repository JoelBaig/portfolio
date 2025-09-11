import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  selectedLanguage: 'en' | 'de' = 'en';
  dotAnimationClass = '';

  selectLanguage(lang: 'en' | 'de') {
    if (lang === this.selectedLanguage) return;

    this.dotAnimationClass =
      lang === 'de' ? 'dot-animate-right' : 'dot-animate-left';

    this.selectedLanguage = lang;
  }
}
