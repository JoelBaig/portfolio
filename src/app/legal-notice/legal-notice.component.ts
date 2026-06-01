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

  /**
   * Navigates back to the home page and scrolls to the top.
   */
  closeToHomeTop(): void {
    this.router.navigateByUrl('/').then(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant' as ScrollBehavior
        });
      });
    });
  }

  /**
   * Navigates to the contact section on the home page.
   */
  closeToContact(): void {
    this.router.navigateByUrl('/#contact').then(() => {
      requestAnimationFrame(() => {
        document.getElementById('contact')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }

  /**
   * Scrolls the page to the top after the view has been initialized.
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

  /**
   * Prevents the default email link behavior and navigates
   * to the contact section instead.
   *
   * @param event The mouse click event.
   */
  onEmailLinkClick(event: MouseEvent): void {
    event.preventDefault();
    this.closeToContact();
  }
}