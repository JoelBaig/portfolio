import { Component, HostListener } from '@angular/core';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-colleagues-thoughts',
  imports: [
    AppHeadlineComponent,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './colleagues-thoughts.component.html',
  styleUrl: './colleagues-thoughts.component.scss'
})
export class ColleaguesThoughtsComponent {
  imageCards = [
    {
      id: 0,
      src: 'assets/img/header/colleagues_thoughts/feedback1.png',
      srcMobile: 'assets/mobile/mobile_card_1.png',
      hoverOverlay: 'assets/img/header/colleagues_thoughts/feedback_hover.png',
      icon: 'assets/img/header/colleagues_thoughts/linkedin.png',
      iconHover: 'assets/img/header/colleagues_thoughts/linkedin_hover.png',
      text: 'COLLEAGUES.CARD_TXT_1',
      name: 'Lukas Brenner',
      job: 'Frontend Developer'
    },
    {
      id: 1,
      src: 'assets/img/header/colleagues_thoughts/feedback2.png',
      srcMobile: 'assets/mobile/mobile_card_2.png',
      hoverOverlay: 'assets/img/header/colleagues_thoughts/feedback_hover.png',
      icon: 'assets/img/header/colleagues_thoughts/linkedin.png',
      iconHover: 'assets/img/header/colleagues_thoughts/linkedin_hover.png',
      text: 'COLLEAGUES.CARD_TXT_2',
      name: 'Sophia Brink',
      job: 'Frontend Developer'
    },
    {
      id: 2,
      src: 'assets/img/header/colleagues_thoughts/feedback1.png',
      srcMobile: 'assets/mobile/mobile_card_3.png',
      hoverOverlay: 'assets/img/header/colleagues_thoughts/feedback_hover.png',
      icon: 'assets/img/header/colleagues_thoughts/linkedin.png',
      iconHover: 'assets/img/header/colleagues_thoughts/linkedin_hover.png',
      text: 'COLLEAGUES.CARD_TXT_3',
      name: 'Jan Köhler',
      job: 'Frontend Developer'
    }
  ];

  isMobile = window.innerWidth <= 800;
  hoveredIndex: number | null = null;

  @HostListener('window:resize')
  onResize(): void {
    this.updateScreenSize();
  }

  private updateScreenSize(): void {
    this.isMobile = window.innerWidth <= 900;
  }

  get displayedCards() {
    if (this.isMobile) {
      return [this.imageCards[1], this.imageCards[0], this.imageCards[2]];
    }

    return this.imageCards;
  }

  getCardStyle(index: number): { [key: string]: string } {
    switch (index) {
      case 0:
        return {
          top: '30%',
          left: '65%',
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
          left: '37%',
          transform: 'translate(-50%, -50%) rotate(-5deg)'
        };
      default:
        return {
          top: '40%',
          left: '20%',
          transform: 'translate(-50%, -50%) rotate(0deg)'
        };
    }
  }

  getTextRotation(cardId: number): string {
    if (this.isMobile) {
      switch (cardId) {
        case 0:
          return 'rotate(0deg)';
        case 1:
          return 'rotate(-4deg)';
        case 2:
          return 'rotate(4deg)';
        default:
          return 'rotate(0deg)';
      }
    }

    switch (cardId) {
      case 0:
        return 'rotate(0deg)';
      case 1:
        return 'rotate(0deg)';
      case 2:
        return 'rotate(0deg)';
      default:
        return 'rotate(0deg)';
    }
  }

  openLinkedIn(card: any): void {
    if (card.link) {
      window.open(card.link, '_blank');
    }
  }

  baseZ(i: number): number {
    return i === 0 ? 30 : i === 1 ? 20 : 10;
  }

  combinedStyle(i: number, cardId: number): { [key: string]: string | number } {
    if (this.isMobile) {
      let rotation = 'none';

      switch (cardId) {
        case 0:
          rotation = 'rotate(0deg)';
          break;
        case 1:
          rotation = 'rotate(-2deg)';
          break;
        case 2:
          rotation = 'rotate(1deg)';
          break;
      }

      return {
        position: 'relative',
        zIndex: 'auto',
        top: 'auto',
        left: 'auto',
        transform: rotation
      };
    }

    const base = this.getCardStyle(i);

    return {
      ...base,
      position: 'absolute',
      zIndex: this.hoveredIndex === i ? 999 : this.baseZ(i),
    };
  }
}