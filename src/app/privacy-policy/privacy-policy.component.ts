import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    TranslateModule
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent implements AfterViewInit {
  private router = inject(Router);
  private readonly contactRestoreKey = 'restoreContactInstantly';

  /**
   * Navigates to the requested portfolio section.
   *
   * @param fragment The target section id.
   */
  navigateToSection(fragment: string): void {
    if (fragment === 'top') {
      void this.router.navigateByUrl('/');
      return;
    }

    void this.navigateAndScroll(fragment);
  }

  /**
   * Navigates to the landing page and scrolls to the target.
   *
   * @param fragment The target section id.
   */
  private async navigateAndScroll(fragment: string): Promise<void> {
    await this.router.navigate(['/'], { fragment });
    this.waitForSection(fragment);
  }

  /**
   * Waits until the requested section exists in the DOM.
   *
   * @param fragment The target section id.
   */
  private waitForSection(fragment: string): void {
    requestAnimationFrame(() => {
      const target = document.getElementById(fragment);

      target
        ? this.scrollToSection(target)
        : setTimeout(() => this.waitForSection(fragment), 50);
    });
  }

  /**
   * Scrolls smoothly to the requested section.
   *
   * @param target The target section element.
   */
  private scrollToSection(target: HTMLElement): void {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  /**
   * Returns to the landing page and marks the contact section
   * for immediate restoration.
   */
  closeToContact(): void {
    sessionStorage.setItem(this.contactRestoreKey, 'true');
    void this.router.navigateByUrl('/');
  }

  /**
   * Scrolls to the top of the page after the view has initialized.
   */
  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    });
  }
}