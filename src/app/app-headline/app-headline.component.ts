import { CommonModule, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Displays a reusable section headline with optional subtitle,
 * info text and configurable decorative line behavior.
 */
@Component({
  selector: 'app-app-headline',
  standalone: true,
  imports: [CommonModule, NgClass, TranslateModule],
  templateUrl: './app-headline.component.html',
  styleUrl: './app-headline.component.scss'
})
export class AppHeadlineComponent implements AfterViewInit, OnChanges {
  @Input() title: string = 'Section Title';
  @Input() subtitle: string = '';
  @Input() infoText: string = '';
  @Input() subtitlePosition: string = 'above';
  @Input() subtitleOffset: number = 10;
  @Input() subtitleUnderLine: boolean = false;
  @Input() subtitleSize = '20px';
  @Input() subtitleWeight: number = 600;
  @Input() subtitleTag: 'h1' | 'h2' | 'h3' = 'h3';
  @Input() infoOffset: number = 16;
  @Input() animateLine: boolean = false;
  @Input() lineImage: string = '';
  @Input() lineWidth: number = 40;
  @Input() mobileLineWidth: number = 200;
  @Input() smallMobileLineWidth: number = 150;
  @Input() tinyMobileLineWidth: number = 100;
  @Input() lineMarginBottom: number = 10;
  @Input() lineAboveTitle: boolean = false;
  @Input() lineLeftOfSubtitle: boolean = false;
  @Input() lineUnderInfoText: boolean = false;
  @Input() lineAlign: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' = 'center';
  @Input() maskDirection: 'horizontal' | 'rtl' | 'circular' = 'horizontal';
  @Input() textAlign: 'left' | 'right' | 'center' = 'left';
  @Input() mobileLineAlign: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | null = null;
  @Input() lineMatchTitle: boolean = false;

  titleWidthPx: number = 0;

  @ViewChild('titleElement') titleElement!: ElementRef<HTMLElement>;

  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Measures the title width after the view has been initialized.
   */
  ngAfterViewInit(): void {
    this.deferMeasure();
  }

  /**
   * Re-measures the title width when relevant input values change.
   *
   * @param changes The changed component input values.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title'] || changes['lineMatchTitle']) {
      this.deferMeasure();
    }
  }

  /**
   * Re-measures the title width after the browser window is resized.
   */
  @HostListener('window:resize')
  onResize(): void {
    this.deferMeasure();
  }

  /**
   * Defers the title width measurement until the browser has rendered the view.
   */
  private deferMeasure(): void {
    if (!this.lineMatchTitle) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.updateTitleWidth();
        this.cdr.detectChanges();
      });
    });
  }

  /**
   * Updates the stored title width if the rendered title size has changed.
   */
  private updateTitleWidth(): void {
    if (!this.lineMatchTitle || !this.titleElement) return;

    const width = this.getTitleWidth();

    if (width !== this.titleWidthPx) {
      this.titleWidthPx = width;
    }
  }

  /**
   * Returns the current rendered title width in pixels.
   *
   * @returns The rounded title width in pixels.
   */
  private getTitleWidth(): number {
    return Math.ceil(
      this.titleElement.nativeElement.getBoundingClientRect().width
    );
  }

  /**
   * Returns the active line alignment depending on the viewport size.
   *
   * @returns The currently used flex alignment value.
   */
  getCurrentLineAlign(): 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' {
    if (window.innerWidth <= 900 && this.mobileLineAlign) {
      return this.mobileLineAlign;
    }

    return this.lineAlign;
  }

  /**
   * Returns the active decorative line width depending on the viewport size.
   *
   * @returns The current line width in pixels.
   */
  getCurrentLineWidth(): number {
    const width = window.innerWidth;

    if (width <= 420) {
      return this.tinyMobileLineWidth;
    }

    if (width <= 500) {
      return this.smallMobileLineWidth;
    }

    if (width <= 600) {
      return this.mobileLineWidth;
    }

    return this.lineWidth;
  }
}