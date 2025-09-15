import { CommonModule, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-app-btn',
  imports: [
    CommonModule,
    NgStyle,
  ],
  templateUrl: './app-btn.component.html',
  styleUrl: './app-btn.component.scss'
})
export class AppBtnComponent {
  @Input() width: string = '300px';
  @Input() height: string = '60px';
  @Input() color: string = 'black';
  @Input() hoverColor: string = 'black';
  @Input() text: string = '';
  @Input() visible: boolean = false;
  @Input() defaultImg: string = '';
  @Input() hoverImg: string = '';

  isHovered = false;
}
