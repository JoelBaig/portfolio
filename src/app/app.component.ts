import { Component, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

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

  constructor() {
    localStorage.removeItem('lang');
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = this.router.parseUrl(this.router.url).fragment;
        if (!fragment) return;

        requestAnimationFrame(() => {
          this.viewportScroller.scrollToAnchor(fragment);
        });
      });
  }
}