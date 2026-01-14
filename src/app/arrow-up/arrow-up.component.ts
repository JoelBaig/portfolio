import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';

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
  @Input() disabled = false;

  showArrowUp = false;
  private lock = false;

  @HostListener('window:scroll', [])

  onWindowScroll() {
    if (this.disabled || this.lock) return;
    this.showArrowUp = window.scrollY > 300;
  }

  scrollToTop() {
    if (this.disabled) return;

    this.lock = true;
    this.showArrowUp = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const check = () => {
      if (window.scrollY <= 0) {
        this.lock = false;
        return;
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }
}