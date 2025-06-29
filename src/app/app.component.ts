import { Component } from '@angular/core';
import { AboutMeSectionComponent } from "./about-me-section/about-me-section.component";
import { HeaderComponent } from "./shared/header/header.component";
import { AppBtnComponent } from "./app-btn/app-btn.component";
import { MySkillsComponent } from './my-skills/my-skills.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    AboutMeSectionComponent, 
    HeaderComponent, 
    AppBtnComponent,
    MySkillsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio-temp';
}
