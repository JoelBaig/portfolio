import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Displays the footer section including social links,
 * legal notice navigation and contact actions.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() showLegalLink = true;
  @Input() theme: 'dark' | 'light' = 'dark';
  @Input() legalAsClose = false;

  @Output() legalNoticeClick = new EventEmitter<void>();
  @Output() emailClick = new EventEmitter<void>();

  over: 'github' | 'linkedin' | 'email' | null = null;
  hasInteracted = false;

  /**
   * Prevents the default link behavior and emits
   * an event to open the legal notice page.
   *
   * @param event The mouse click event.
   */
  openLegalNotice(event: MouseEvent): void {
    event.preventDefault();
    this.legalNoticeClick.emit();
  }

  /**
   * Prevents the default email link behavior and emits
   * an event to handle email navigation externally.
   *
   * @param event The optional mouse click event.
   */
  onEmailClick(event?: MouseEvent): void {
    event?.preventDefault();
    this.emailClick.emit();
  }
}