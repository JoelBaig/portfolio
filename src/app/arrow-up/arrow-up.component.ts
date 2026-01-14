import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-arrow-up',
  imports: [
    CommonModule,
    NgIf
  ],
  templateUrl: './arrow-up.component.html',
  styleUrl: './arrow-up.component.scss',
})
export class ArrowUpComponent {
  showArrowUp = false;

  @HostListener('window:scroll', [])

  onWindowScroll() {
    this.showArrowUp = window.scrollY > 200;
  }

  scrollToTop() {
    this.showArrowUp = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
