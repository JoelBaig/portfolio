import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent, FooterComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  constructor() {

  }
}
