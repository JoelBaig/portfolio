import { Component } from '@angular/core';
import { LegalNoticeComponent } from '../../legal-notice/legal-notice.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    LegalNoticeComponent
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  over: 'github' | 'linkedin' | 'email' | null = null;
  hasInteracted = false;
  overlay: string | null = null;
  isLegalNoticeOpen = false;

  openLegalNotice(event: MouseEvent) {
    event.preventDefault();
    this.isLegalNoticeOpen = true;
  }

  closeLegalNotice() {
    this.isLegalNoticeOpen = false;
  }
}
