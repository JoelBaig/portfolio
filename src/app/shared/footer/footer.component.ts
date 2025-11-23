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

  // 1. State für das Overlay
  isLegalNoticeOpen = false;

  // 2. Öffnen
  openLegalNotice(event: MouseEvent) {
    event.preventDefault(); // verhindert, dass der Link irgendwas navigiert
    this.isLegalNoticeOpen = true;
  }

  // 3. Schließen
  closeLegalNotice() {
    this.isLegalNoticeOpen = false;
  }
}
