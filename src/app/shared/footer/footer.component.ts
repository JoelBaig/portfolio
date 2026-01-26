import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() showLegalLink = true;
  @Input() theme: 'dark' | 'light' = 'dark';

  @Output() legalNoticeClick = new EventEmitter<void>();
  @Output() emailClick = new EventEmitter<void>();

  over: 'github' | 'linkedin' | 'email' | null = null;
  hasInteracted = false;
  activeSection: string | null = null;

  openLegalNotice(event: MouseEvent) {
    event.preventDefault();
    this.legalNoticeClick.emit();
  }

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection = sectionId;
    }
  }

  onEmailClick() {
    this.emailClick.emit();        // ✅ sagt Parent: Email wurde geklickt
    this.scrollToSection('contact');
  }
}