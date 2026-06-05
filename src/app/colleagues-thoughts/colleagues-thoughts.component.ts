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
      iconMobileHover: 'assets/mobile/mobile_card_hover.png',
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
      iconMobileHover: 'assets/mobile/mobile_card_hover.png',
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
      iconMobileHover: 'assets/mobile/mobile_card_hover.png',
      text: 'COLLEAGUES.CARD_TXT_3',
      name: 'Jan Köhler',
      job: 'Frontend Developer'
    }
  ];

  isMobile = window.innerWidth <= 900;
  hoveredIndex: number | null = null;

  /**
   * Updates the current screen size state when the window is resized.
   */
  @HostListener('window:resize')
  onResize(): void {
    this.updateScreenSize();
  }

  /**
   * Updates the mobile screen state based on the viewport width.
   */
  private updateScreenSize(): void {
    this.isMobile = window.innerWidth <= 900;
  }

  /**
   * Returns the cards in the order they should be displayed.
   *
   * @returns The ordered array of colleague cards.
   */
  get displayedCards() {
    if (this.isMobile) {
      return [this.imageCards[1], this.imageCards[0], this.imageCards[2]];
    }

    return this.imageCards;
  }

  /**
   * Returns the card positioning style based on its index.
   *
   * @param index The card index.
   * @returns A style object containing positioning values.
   */
  getCardStyle(index: number): { [key: string]: string } {
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
   * Returns the style configuration for the first card.
   *
   * @returns The card style object.
   */
  private styleCase0() {
    return {
      top: '30%',
      left: '75%',
      transform: 'translate(-50%, -50%) rotate(5deg)'
    };
  }

  /**
   * Returns the style configuration for the second card.
   *
   * @returns The card style object.
   */
  private styleCase1() {
    return {
      top: '38%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(0deg)'
    };
  }

  /**
   * Returns the style configuration for the third card.
   *
   * @returns The card style object.
   */
  private styleCase2() {
    return {
      top: '30%',
      left: '26%',
      transform: 'translate(-50%, -50%) rotate(-5deg)'
    };
  }

  /**
   * Returns the default card style.
   *
   * @returns A fallback style object.
   */
  private styleDefault() {
    return {
      top: '40%',
      left: '20%',
      transform: 'translate(-50%, -50%) rotate(0deg)'
    };
  }

  /**
   * Returns the text rotation based on the card id and screen size.
   *
   * @param cardId The id of the card.
   * @returns A CSS rotation value.
   */
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

    return 'rotate(0deg)';
  }

  /**
   * Opens the LinkedIn profile of the selected card in a new tab.
   *
   * @param card The selected colleague card.
   */
  openLinkedIn(card: any): void {
    if (card.link) {
      window.open(card.link, '_blank');
    }
  }

  /**
   * Returns the default z-index for a card based on its position.
   *
   * @param i The card index.
   * @returns The z-index value.
   */
  baseZ(i: number): number {
    return i === 0 ? 30 : i === 1 ? 20 : 10;
  }

  /**
   * Returns the combined style configuration depending on the current device type.
   *
   * @param i The card index.
   * @param cardId The card id.
   * @returns The final style object.
   */
  combinedStyle(i: number, cardId: number): { [key: string]: string | number } {
    if (this.isMobile) {
      return this.getMobileStyle(cardId);
    }

    return this.getDesktopStyle(i);
  }

  /**
   * Returns the mobile style configuration for a card.
   *
   * @param cardId The card id.
   * @returns The mobile style object.
   */
  private getMobileStyle(cardId: number): { [key: string]: string | number } {
    return {
      position: 'relative',
      zIndex: 'auto',
      top: 'auto',
      left: 'auto',
      transform: this.getMobileRotation(cardId)
    };
  }

  /**
   * Returns the rotation value used on mobile devices.
   *
   * @param cardId The card id.
   * @returns A CSS rotation value.
   */
  private getMobileRotation(cardId: number): string {
    const rotations = [
      'rotate(0deg)',
      'rotate(-2deg)',
      'rotate(1deg)'
    ];

    return rotations[cardId] || 'rotate(0deg)';
  }

  /**
   * Returns the desktop style configuration for a card.
   *
   * @param i The card index.
   * @returns The desktop style object.
   */
  private getDesktopStyle(i: number): { [key: string]: string | number } {
    const base = this.getCardStyle(i);

    return {
      ...base,
      position: 'absolute',
      zIndex: this.hoveredIndex === i ? 999 : this.baseZ(i)
    };
  }
}