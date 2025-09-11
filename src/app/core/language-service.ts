// src/app/core/language.service.ts
import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'en' | 'de';
const STORAGE_KEY = 'app.lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private ts = inject(TranslateService);
  private _inited = false;
  readonly supported: Lang[] = ['en', 'de'];

  init(): void {
    if (this._inited) return;
    this._inited = true;

    this.ts.addLangs(this.supported);
    this.ts.setDefaultLang('en'); // Fallback auf EN

    const stored = (localStorage.getItem(STORAGE_KEY) as Lang | null);
    const browser = (navigator.language?.slice(0, 2) as Lang) || 'en';
    const initial: Lang =
      (stored && this.supported.includes(stored)) ? stored :
      (this.supported.includes(browser) ? browser : 'en');

    this.use(initial);
  }

  use(lang: Lang): void {
    if (!this.supported.includes(lang)) return;
    this.ts.use(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }

  current(): Lang {
    return (this.ts.currentLang as Lang) || 'en';
  }

  toggle(): Lang {
    const next: Lang = this.current() === 'en' ? 'de' : 'en';
    this.use(next);
    return next;
  }
}