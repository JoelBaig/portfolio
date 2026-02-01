import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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

  openLegalNotice(event: MouseEvent) {
    event.preventDefault();
    this.legalNoticeClick.emit();
  }

  onEmailClick(event?: MouseEvent) {
    event?.preventDefault();
    this.emailClick.emit();
  }
}