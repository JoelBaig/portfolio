import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-app-headline',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    TranslateModule
  ],
  templateUrl: './app-headline.component.html',
  styleUrl: './app-headline.component.scss'
})
export class AppHeadlineComponent implements AfterViewInit {
  // Diese Inputs sind jetzt "Keys" (z.B. "CONTACT.TITLE")
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
  @Input() titleWidthPx: number = 0;

  @ViewChild('titleElement') titleElement!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    this.updateTitleWidth();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateTitleWidth();
  }

  private updateTitleWidth() {
    if (!this.lineMatchTitle || !this.titleElement) return;
    this.titleWidthPx = Math.ceil(this.titleElement.nativeElement.getBoundingClientRect().width);
  }
}