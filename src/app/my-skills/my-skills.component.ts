import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-skills',
  imports: [NgIf],
  templateUrl: './my-skills.component.html',
  styleUrl: './my-skills.component.scss'
})

export class MySkillsComponent {
  stickers = [
    'assets/img/header/skills/sticker.png',
    'assets/img/header/skills/sticker_hover.png',
    'assets/img/header/skills/sticker_open.png'
  ];

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