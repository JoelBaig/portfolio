import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';

/**
 * Displays a floating "scroll to top" button that appears
 * after the user has scrolled down the page.
 */
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

  /**
   * Updates the visibility of the arrow button based on
   * the current scroll position.
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.disabled || this.lock) {
      return;
    }

    this.showArrowUp = window.scrollY > 300;
  }

  /**
   * Smoothly scrolls the page back to the top and temporarily
   * hides the arrow button until scrolling is complete.
   */
  scrollToTop(): void {
    if (this.disabled) {
      return;
    }

    this.lock = true;
    this.showArrowUp = false;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    requestAnimationFrame(() => this.checkScrollFinished());
  }

  /**
   * Checks whether the page has finished scrolling to the top
   * and releases the scroll lock.
   */
  private checkScrollFinished(): void {
    if (window.scrollY <= 0) {
      this.lock = false;
      return;
    }

    requestAnimationFrame(() => this.checkScrollFinished());
  }
}