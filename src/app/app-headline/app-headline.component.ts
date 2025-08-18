import { CommonModule, NgClass } from '@angular/common';
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
  @Input() infoText: string = '';
  @Input() lineImage: string = '';
  @Input() animateLine: boolean = false;
  @Input() lineWidth: number = 340;
  @Input() lineMarginBottom: number = 50;
  @Input() lineAlign: 'flex-start' | 'center' | 'flex-end' = 'center';
  @Input() maskDirection: 'horizontal' | 'rtl' | 'circular' = 'horizontal';
  @Input() textAlign: 'left' | 'right' | 'center' = 'left';
  @Input() lineAboveTitle: boolean = false;
  @Input() lineLeftOfSubtitle: boolean = false;
  @Input() lineUnderInfoText: boolean = false;
}