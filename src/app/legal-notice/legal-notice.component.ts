import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

/**
 * Displays the legal notice page and provides navigation
 * back to the home page or contact section.
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
   * Navigates back to the home page and scrolls to the top.
   */
  closeToHomeTop(): void {
    this.router.navigateByUrl('/').then(() => {
      this.scrollToPageTopInstantly();
    });
  }

  /**
   * Navigates back to the home page and restores the contact section.
   */
  closeToContact(): void {
    this.markContactRestore();
    this.router.navigateByUrl('/');
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