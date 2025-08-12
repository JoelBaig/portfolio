import { Component } from '@angular/core';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-colleagues-thoughts',
  imports: [
    AppHeadlineComponent,
    CommonModule,
  ],
  templateUrl: './colleagues-thoughts.component.html',
  styleUrl: './colleagues-thoughts.component.scss'
})
export class ColleaguesThoughtsComponent {
  imageCards = [
    {
      src: 'assets/img/header/colleagues_thoughts/feedback1.png',
      hoverOverlay: 'assets/img/header/colleagues_thoughts/feedback_hover.png',
      icon: 'assets/img/header/colleagues_thoughts/linkedin.png',
      iconHover: 'assets/img/header/colleagues_thoughts/linkedin_hover.png',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      name: 'Tobias Lange',
      job: 'Frontend Developer'
    },
    {
      src: 'assets/img/header/colleagues_thoughts/feedback2.png',
      hoverOverlay: 'assets/img/header/colleagues_thoughts/feedback_hover.png',
      icon: 'assets/img/header/colleagues_thoughts/linkedin.png',
      iconHover: 'assets/img/header/colleagues_thoughts/linkedin_hover.png',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      name: 'Maria Schäfer',
      job: 'Frontend Developer'
    },
    {
      src: 'assets/img/header/colleagues_thoughts/feedback1.png',
      hoverOverlay: 'assets/img/header/colleagues_thoughts/feedback_hover.png',
      icon: 'assets/img/header/colleagues_thoughts/linkedin.png',
      iconHover: 'assets/img/header/colleagues_thoughts/linkedin_hover.png',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      name: 'David Braun',
      job: 'Frontend Developer'
    }
  ];

  hoveredIndex: number | null = null;

  getCardStyle(index: number): { [key: string]: string } {
    switch (index) {
      case 0: 
        return {
          top: '30%',
          left: '75%',
          transform: 'translate(-50%, -50%) rotate(5deg)' 
        };
      case 1: 
        return {
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(0deg)'
        };
      case 2:
        return {
          top: '30%',
          left: '25%',
          transform: 'translate(-50%, -50%) rotate(-5deg)'
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
      case 0: return 'rotate(0deg)';
      case 1: return 'rotate(0deg)';
      case 2: return 'rotate(0deg)';
      default: return 'rotate(0deg)';
    }
  }

  openLinkedIn(card: any) {
    if (card.link) { window.open(card.link, '_blank'); }
  }

  baseZ(i: number): number {
    return i === 0 ? 30 : i === 1 ? 20 : 10;
  }

  combinedStyle(i: number): { [key: string]: string | number } {
    const base = this.getCardStyle(i);
    return {
      ...base,
      position: 'absolute',
      zIndex: this.hoveredIndex === i ? 999 : this.baseZ(i),
    };
  }
}
