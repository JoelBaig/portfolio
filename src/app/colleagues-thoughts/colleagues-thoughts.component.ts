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
      srcCardHover: 'assets/img/header/colleagues_thoughts/feedback_hover.png',
      icon: 'assets/img/header/about_me/location_icon_position.png',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      name: 'Tobias Lange'
    },
    {
      src: 'assets/img/header/colleagues_thoughts/feedback2.png',
      srcCardHover: 'assets/img/header/colleagues_thoughts/feedback_hover.png',
      icon: 'assets/img/header/about_me/location_icon_route.png',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      name: 'Maria Schäfer'
    },
    {
      src: 'assets/img/header/colleagues_thoughts/feedback1.png',
      srcHover: 'assets/img/header/colleagues_thoughts/feedback_hover.png',
      icon: 'assets/img/header/about_me/location_icon_home.png',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      name: 'David Braun'
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
}
