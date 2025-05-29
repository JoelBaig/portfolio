import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-me-section',
  imports: [CommonModule],
  templateUrl: './about-me-section.component.html',
  styleUrl: './about-me-section.component.scss'
})
export class AboutMeSectionComponent {
  images: string[] = [
    'assets/img/header/about_me/Ripped_paper_yellow.png',
    'assets/img/header/about_me/Ripped_paper_blue.png',
    'assets/img/header/about_me/Ripped_paper_orange.png'
  ]
}
