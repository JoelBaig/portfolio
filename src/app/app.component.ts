// import { Component } from '@angular/core';
// import { AboutMeSectionComponent } from "./about-me-section/about-me-section.component";
// import { HeaderComponent } from "./shared/header/header.component";
// import { MySkillsComponent } from './my-skills/my-skills.component';
// import { NavbarComponent } from './navbar/navbar.component';
// import { ProjectsComponent } from './projects/projects.component';
// import { ColleaguesThoughtsComponent } from "./colleagues-thoughts/colleagues-thoughts.component";
// import { ContactFormComponent } from './contact-form/contact-form.component';
// import { FormsModule } from '@angular/forms';
// import { FooterComponent } from "./shared/footer/footer.component";
// import { LandingPageComponent } from "./landing-page/landing-page.component";

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     LandingPageComponent,
//     NavbarComponent,
//     AboutMeSectionComponent,
//     HeaderComponent,
//     MySkillsComponent,
//     ProjectsComponent,
//     ColleaguesThoughtsComponent,
//     ContactFormComponent,
//     FormsModule,
//     FooterComponent,
//     LandingPageComponent,
// ],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })
// export class AppComponent {
//   title = 'portfolio-temp';
// }

// src/app/app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from "./shared/header/header.component";
import { NavbarComponent } from './navbar/navbar.component';
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { AboutMeSectionComponent } from "./about-me-section/about-me-section.component";
import { MySkillsComponent } from './my-skills/my-skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { ColleaguesThoughtsComponent } from "./colleagues-thoughts/colleagues-thoughts.component";
import { ContactFormComponent } from './contact-form/contact-form.component';
import { FooterComponent } from "./shared/footer/footer.component";
import { LanguageService } from './core/language-service';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // Nur Standalone-Components/Directives/Pipes oder NgModules hier!
    HeaderComponent,
    NavbarComponent,
    LandingPageComponent,
    AboutMeSectionComponent,
    MySkillsComponent,
    ProjectsComponent,
    ColleaguesThoughtsComponent,
    ContactFormComponent,
    FooterComponent,
    FormsModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private lang: LanguageService) {}

  ngOnInit(): void {
    this.lang.init(); // Sprache initialisieren (setzt Fallback, liest localStorage, etc.)
  }
}