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

  /**
   * Returns the text style configuration based on the image block index.
   *
   * @param index The index of the image block.
   * @returns A style object containing positioning and transform values.
   */
  getTextStyle(index: number): { [key: string]: string } {
    switch (index) {
      case 0:
        return this.styleCase0();

      case 1:
        return this.styleCase1();

      case 2:
        return this.styleCase2();

      default:
        return this.styleDefault();
    }
  }

  /**
   * Returns the style configuration for the first image block.
   *
   * @returns A style object for the first text position.
   */
  private styleCase0() {
    return {
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-5deg)'
    };
  }

  /**
   * Returns the style configuration for the second image block.
   *
   * @returns A style object for the second text position.
   */
  private styleCase1() {
    return {
      top: '45%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(0deg)'
    };
  }

  /**
   * Returns the style configuration for the third image block.
   *
   * @returns A style object for the third text position.
   */
  private styleCase2() {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(5deg)'
    };
  }

  /**
   * Returns the default style configuration.
   *
   * @returns A fallback style object.
   */
  private styleDefault() {
    return {
      top: '40%',
      left: '20%',
      transform: 'translate(-50%, -50%)'
    };
  }

  /**
   * Returns the rotation value for the text depending on its index.
   *
   * @param index The index of the image block.
   * @returns A CSS rotation value.
   */
  getTextRotation(index: number): string {
    switch (index) {
      case 0: return 'rotate(-4deg)';
      case 1: return 'rotate(0deg)';
      case 2: return 'rotate(4deg)';
      default: return 'rotate(0deg)';
    }
  }

  /**
   * Smoothly scrolls to the specified section and updates the active section.
   *
   * @param sectionId The id of the target section.
   */
  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      this.activeSection = sectionId;
    }
  }

  /**
   * Updates the currently active section based on the scroll position.
   */
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