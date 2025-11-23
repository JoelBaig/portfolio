import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';

@Component({
  selector: 'app-my-skills',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgFor,
  ],
  templateUrl: './my-skills.component.html',
  styleUrl: './my-skills.component.scss'
})
export class MySkillsComponent {
  skillsTop = [
    { name: 'HTML', src: './assets/img/header/skills/html.png' },
    { name: 'CSS', src: './assets/img/header/skills/css.png' },
    { name: 'JavaScript', src: './assets/img/header/skills/js.png' },
    { name: 'TypeScript', src: './assets/img/header/skills/ts.png' },
    { name: 'Angular', src: './assets/img/header/skills/angular.png' },
  ];

  skillsBottom = [
    { name: 'Firebase', src: './assets/img/header/skills/firebase.png' },
    { name: 'Git', src: './assets/img/header/skills/git.png' },
    { name: 'REST-API', src: './assets/img/header/skills/restapi.png' },
    { name: 'Scrum', src: './assets/img/header/skills/scrum.png' },
    { name: 'Material Design', src: './assets/img/header/skills/materialdesign.png' }
  ];

  stickerSkills = [
    { src: './assets/img/header/skills/sticker_react.png', name: 'React' },
    { src: './assets/img/header/skills/sticker_vuejs.png', name: 'Vue.js' }
  ];

  stickerStyles: any = {
    transform: 'rotate(10deg) scale(1)',
    opacity: 1,
    transition: 'transform 0.3s ease, opacity 0.3s ease'
  };

  hoveredSkill: string | null = null;
  animateOval = true;

  stickers = [
    'assets/img/header/skills/sticker.png',
    'assets/img/header/skills/sticker_hover.png',
    'assets/img/header/skills/sticker_open.png'
  ];

  stickerIndex = 0;
  isOpen = false;
  isAnimating = false;

  get currentSticker(): string {
    return this.stickers[this.stickerIndex];
  }

  animateSticker(): void {
    if (this.isAnimating) return;

    if (this.isOpen) {
      this.stickerIndex = 0;
      this.isOpen = false;
      return;
    }

    this.isAnimating = true;
    this.stickerIndex = 1;

    setTimeout(() => {
      this.stickerIndex = 2;
      this.isAnimating = false;
      this.isOpen = true;
    }, 60);
  }
  
  resetSticker(): void {
    this.stickerStyles = {
      ...this.stickerStyles,
      transform: 'rotate(-60deg) scale(0.1)',
      opacity: 0.1
    };

    setTimeout(() => {
      this.stickerIndex = 0;
      this.isOpen = false;
      this.stickerStyles = {
        ...this.stickerStyles,
        transform: 'rotate(10deg) scale(1)',
        opacity: 1
      };
    }, 300);
  }
}