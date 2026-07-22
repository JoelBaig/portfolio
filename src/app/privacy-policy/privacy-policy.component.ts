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
   * Returns to the landing page and marks the contact section
   * for immediate restoration.
   */
  closeToContact(): void {
    sessionStorage.setItem(this.contactRestoreKey, 'true');
    this.router.navigateByUrl('/');
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