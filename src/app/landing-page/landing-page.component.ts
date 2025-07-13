import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AboutMeSectionComponent } from '../about-me-section/about-me-section.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  // imports: [
  //   NavbarComponent,
    // AboutMeSectionComponent,
  // ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  constructor() {

  }
}
