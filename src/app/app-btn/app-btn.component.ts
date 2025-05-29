import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-app-btn',
  imports: [CommonModule],
  templateUrl: './app-btn.component.html',
  styleUrl: './app-btn.component.scss'
})
export class AppBtnComponent {
  @Input() text: string = '';
  @Input() className: string = '';
  @Input() visible: boolean = false;
}
