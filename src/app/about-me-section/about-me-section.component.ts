import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { AppBtnComponent } from '../app-btn/app-btn.component';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-me-section',
  imports: [
    CommonModule,
    AppBtnComponent,
    AppHeadlineComponent,
    TranslateModule
  ],
  templateUrl: './about-me-section.component.html',
  styleUrl: './about-me-section.component.scss'
})
export class AboutMeSectionComponent {
  activeSection: string | null = null;

  imageBlocks = [
    {
      src: 'assets/img/header/about_me/Ripped_paper_yellow.png',
      icon: 'assets/img/header/about_me/location_icon_position.png',
      text: 'Based in Emsdetten'
    },
    {
      src: 'assets/img/header/about_me/Ripped_paper_blue.png',
      icon: 'assets/img/header/about_me/location_icon_route.png',
      text: 'Open to relocate'
    },
    {
      src: 'assets/img/header/about_me/Ripped_paper_orange.png',
      icon: 'assets/img/header/about_me/location_icon_home.png',
      text: 'Open to work remote'
    }
  ];

  getTextStyle(index: number): { [key: string]: string } {
    switch (index) {
      case 0:
        return {
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-5deg)'
        };
      case 1:
        return {
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(0deg)'
        };
      case 2:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(5deg)'
        };
      default:
        return {
          top: '40%',
          left: '20%',
          transform: 'translate(-50%, -50%)'
        };
    }
  }

  getTextRotation(index: number): string {
    switch (index) {
      case 0: return 'rotate(-4deg)';
      case 1: return 'rotate(0deg)';
      case 2: return 'rotate(4deg)';
      default: return 'rotate(0deg)';
    }
  }

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection = sectionId;
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const sections = ['about-me', 'skills', 'projects', 'contact'];
    let found = false;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          this.activeSection = id;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      this.activeSection = null;
    }
  }
}
