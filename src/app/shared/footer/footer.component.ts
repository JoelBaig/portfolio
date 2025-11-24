import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
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
