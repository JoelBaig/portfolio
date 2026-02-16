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
  @Input() lineMarginBottom: number = 50;
  @Input() lineAboveTitle: boolean = false;
  @Input() lineLeftOfSubtitle: boolean = false;
  @Input() lineUnderInfoText: boolean = false;

  @Input() lineAlign: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' = 'center';
  @Input() maskDirection: 'horizontal' | 'rtl' | 'circular' = 'horizontal';
  @Input() textAlign: 'left' | 'right' | 'center' = 'left';

  @Input() lineMatchTitle: boolean = false;

  titleWidthPx: number = 0;

  @ViewChild('titleElement') titleElement!: ElementRef<HTMLElement>;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.deferMeasure();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['title'] || changes['lineMatchTitle']) {
      this.deferMeasure();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.deferMeasure();
  }

  private deferMeasure() {
    if (!this.lineMatchTitle) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.updateTitleWidth();
        this.cdr.detectChanges();
      });
    });
  }

  private updateTitleWidth() {
    if (!this.lineMatchTitle || !this.titleElement) return;

    const w = Math.ceil(this.titleElement.nativeElement.getBoundingClientRect().width);
    if (w !== this.titleWidthPx) {
      this.titleWidthPx = w;
    }
  }
}