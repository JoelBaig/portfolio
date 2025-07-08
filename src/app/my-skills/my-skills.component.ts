import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-skills',
  imports: [NgIf, NgClass, NgFor],
  templateUrl: './my-skills.component.html',
  styleUrl: './my-skills.component.scss'
})

export class MySkillsComponent {
  stickers = [
    'assets/img/header/skills/sticker.png',
    'assets/img/header/skills/sticker_hover.png',
    'assets/img/header/skills/sticker_open.png'
  ];

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

  hoveredSkill: string | null = null;

  animateOval = true;
  currentSticker = this.stickers[0];
  isOpen = false;
  private isAnimating = false;

  animateSticker() {
    if (this.isAnimating) return;

    if (this.isOpen) {
      this.currentSticker = this.stickers[0];
      this.isOpen = false;
      return;
    }

    this.isAnimating = true;
    this.currentSticker = this.stickers[1];

    setTimeout(() => {
      this.currentSticker = this.stickers[2];
      this.isAnimating = false;
      this.isOpen = true;
    }, 60);
  }

  resetSticker() {
    this.currentSticker = this.stickers[0];
    this.isOpen = false;
  }
}