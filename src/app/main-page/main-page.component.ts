import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageComponent } from "../landing-page/landing-page.component";
import { AboutMeSectionComponent } from "../about-me-section/about-me-section.component";
import { MySkillsComponent } from "../my-skills/my-skills.component";
import { ProjectsComponent } from "../projects/projects.component";
import { ColleaguesThoughtsComponent } from "../colleagues-thoughts/colleagues-thoughts.component";
import { ContactFormComponent } from "../contact-form/contact-form.component";
import { ArrowUpComponent } from "../arrow-up/arrow-up.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    LandingPageComponent,
    AboutMeSectionComponent,
    MySkillsComponent,
    ProjectsComponent,
    ColleaguesThoughtsComponent,
    ContactFormComponent,
    ArrowUpComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  isProjectsOpen = false;
}