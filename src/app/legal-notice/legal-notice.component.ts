import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {

  @Output() close = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent) {
    this.close.emit();
  }
} 