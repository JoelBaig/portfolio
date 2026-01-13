import { Component } from '@angular/core';
import { AboutMeSectionComponent } from "./about-me-section/about-me-section.component";
import { MySkillsComponent } from './my-skills/my-skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { ColleaguesThoughtsComponent } from "./colleagues-thoughts/colleagues-thoughts.component";
import { ContactFormComponent } from './contact-form/contact-form.component';
// import { FormsModule } from '@angular/forms';
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LandingPageComponent,
    AboutMeSectionComponent,
    MySkillsComponent,
    ProjectsComponent,
    ColleaguesThoughtsComponent,
    ContactFormComponent,
    // FormsModule,
    LandingPageComponent,
    LegalNoticeComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio-temp';

  isLegalNoticeOpen = false;

  openLegalNotice() { this.isLegalNoticeOpen = true; }
  closeLegalNotice() { this.isLegalNoticeOpen = false; }
}
