import { Component } from '@angular/core';
import { AboutMeSectionComponent } from "./about-me-section/about-me-section.component";
import { HeaderComponent } from "./shared/header/header.component";
import { AppBtnComponent } from "./app-btn/app-btn.component";
import { MySkillsComponent } from './my-skills/my-skills.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectsComponent } from './projects/projects.component';
import { ColleaguesThoughtsComponent } from "./colleagues-thoughts/colleagues-thoughts.component";
import { AppHeadlineComponent } from './app-headline/app-headline.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    AboutMeSectionComponent,
    HeaderComponent,
    MySkillsComponent,
    ProjectsComponent,
    ColleaguesThoughtsComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio-temp';
}
