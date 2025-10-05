import { CommonModule, NgClass} from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-app-headline',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
  ],
  templateUrl: './app-headline.component.html',
  styleUrl: './app-headline.component.scss'
})
export class AppHeadlineComponent {
  @Input() title: string = 'Section Title';
  @Input() subtitle: string = '';
  @Input() subtitlePosition: string = 'above';
  @Input() subtitleOffset: number = 10;
  @Input() subtitleUnderLine: boolean = false;
  @Input() subtitleSize = '20px';
  @Input() subtitleWeight: number = 600;
  @Input() subtitleTag: 'h1' | 'h2' | 'h3' = 'h3';
  @Input() infoOffset: number = 16;
  @Input() infoText: string = '';
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
}