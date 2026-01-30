import { Component } from '@angular/core';
import { AboutMeSectionComponent } from "./about-me-section/about-me-section.component";
import { MySkillsComponent } from './my-skills/my-skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { ColleaguesThoughtsComponent } from "./colleagues-thoughts/colleagues-thoughts.component";
import { ContactFormComponent } from './contact-form/contact-form.component';
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { CommonModule } from '@angular/common';
import { ArrowUpComponent } from './arrow-up/arrow-up.component';

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
    LandingPageComponent,
    LegalNoticeComponent,
    ArrowUpComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio-temp';

  isLegalNoticeOpen = false;
  isProjectsOpen = false;

  openProjects() {
    this.isProjectsOpen = true;
  }

  closeProjects() {
    this.isProjectsOpen = false;
  }

  openLegalNotice() {
    this.isLegalNoticeOpen = true;
  }

  closeLegalNotice() {
    this.isLegalNoticeOpen = false;
  }

  closeLegalNoticeAndScrollToContact() {
    this.isLegalNoticeOpen = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
}

