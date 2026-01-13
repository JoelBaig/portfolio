// import { Component } from '@angular/core';
// import { LegalNoticeComponent } from '../../legal-notice/legal-notice.component';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-footer',
//   standalone: true,
//   imports: [
//     LegalNoticeComponent,
//     CommonModule,
//     RouterModule
//   ],
//   templateUrl: './footer.component.html',
//   styleUrl: './footer.component.scss'
// })
// export class FooterComponent {
//   over: 'github' | 'linkedin' | 'email' | null = null;
//   hasInteracted = false;
//   overlay: string | null = null;
//   isLegalNoticeOpen = false;

//   openLegalNotice(event: MouseEvent) {
//     event.preventDefault();
//     this.isLegalNoticeOpen = true;
//   }

//   closeLegalNotice() {
//     this.isLegalNoticeOpen = false;
//   }
// }


import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Output() legalNoticeClick = new EventEmitter<void>();

  over: 'github' | 'linkedin' | 'email' | null = null;
  hasInteracted = false;

  openLegalNotice(event: MouseEvent) {
    event.preventDefault();
    this.legalNoticeClick.emit();
  }
}