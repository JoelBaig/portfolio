import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-app-btn',
  imports: [CommonModule],
  templateUrl: './app-btn.component.html',
  styleUrl: './app-btn.component.scss'
})
export class AppBtnComponent {
  @Input() width: string = '300px';
  @Input() height: string = '60px';
  @Input() color: string = 'black'; 
  @Input() text: string = '';
  @Input() visible: boolean = false;
  @Input() defaultImg: string = '';
  @Input() hoverImg: string = '';
}
