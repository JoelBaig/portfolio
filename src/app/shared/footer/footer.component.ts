import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIf
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() showLegalLink = true;
  @Input() theme: 'dark' | 'light' = 'dark';

  @Output() legalNoticeClick = new EventEmitter<void>();

  over: 'github' | 'linkedin' | 'email' | null = null;
  hasInteracted = false;

  openLegalNotice(event: MouseEvent) {
    event.preventDefault();
    this.legalNoticeClick.emit();
  }
}