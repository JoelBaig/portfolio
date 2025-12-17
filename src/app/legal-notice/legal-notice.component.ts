import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
  ],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    document.body.classList.add('modal-open');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('modal-open');
  }

  onBackdropClick() {
    this.close.emit();
  }
}