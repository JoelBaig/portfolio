import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    AppHeadlineComponent
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent {
  @Input() projectId!: string;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}