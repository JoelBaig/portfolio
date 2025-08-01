import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-app-headline',
  standalone: true,
  imports: [
    CommonModule,
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
  @Input() lineWidth: string = '340px';
  @Input() maskDirection: 'horizontal' | 'circular' = 'horizontal';
}