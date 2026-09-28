import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

/**
 * Displays the legal notice page and provides navigation
 * back to the home page or requested portfolio section.
 */
@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    TranslateModule
  ],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent implements AfterViewInit {
  isMobileMenuOpen = false;

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
   * Navigates back to the home page and scrolls to the top.
   */
  closeToHomeTop(): void {
    void this.router.navigateByUrl('/');
  }

  /**
   * Navigates back to the home page and restores the contact section.
   */
  closeToContact(): void {
    this.markContactRestore();
    void this.router.navigateByUrl('/');
  }

  /**
   * Scrolls the legal notice page to the top after initialization.
   */
  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.scrollToPageTopInstantly();
    });
  }

  /**
   * Prevents the default email link behavior and returns to contact.
   *
   * @param event The mouse click event.
   */
  onEmailLinkClick(event: MouseEvent): void {
    event.preventDefault();
    this.closeToContact();
  }

  /**
   * Stores the contact restore request for the home page.
   */
  private markContactRestore(): void {
    sessionStorage.setItem(this.contactRestoreKey, 'true');
  }

  /**
   * Instantly scrolls to the top of the page.
   */
  private scrollToPageTopInstantly(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }
}