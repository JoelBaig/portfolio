import { Component } from '@angular/core';
import { AboutMeSectionComponent } from "./about-me-section/about-me-section.component";
import { HeaderComponent } from "./shared/header/header.component";
import { MySkillsComponent } from './my-skills/my-skills.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectsComponent } from './projects/projects.component';
import { ColleaguesThoughtsComponent } from "./colleagues-thoughts/colleagues-thoughts.component";
import { ContactFormComponent } from './contact-form/contact-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    AboutMeSectionComponent,
    HeaderComponent,
    MySkillsComponent,
    ProjectsComponent,
    ColleaguesThoughtsComponent,
    ContactFormComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio-temp';
}
