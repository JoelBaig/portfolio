import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-skills',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, TranslateModule],
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

  hoveredSkill: string | null = null;
  animateOval = true;
  isOpen = false;
  private dragging = false;
  private startX = 0;
  private startY = 0;

  peelProgress = 0;

  private readonly peelDistance = 220;
  private readonly openThreshold = 0.85;

  topStickerSrc = 'assets/img/header/skills/sticker.png';
  peelClipPath = this.calcClipPath(0);

  onTopHover(hovered: boolean) {
    if (this.isOpen || this.dragging) return;
    this.topStickerSrc = hovered
      ? 'assets/img/header/skills/sticker_hover.png'
      : 'assets/img/header/skills/sticker.png';
  }

  onPeelStart(e: PointerEvent) {
    if (this.isOpen) return;
    this.dragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.topStickerSrc = 'assets/img/header/skills/sticker_hover.png';

    e.preventDefault();
  }

  onPeelMove(e: PointerEvent) {
    if (!this.dragging || this.isOpen) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const pullX = Math.max(0, -dx);
    const pullY = Math.max(0, dy);
    const pull = Math.sqrt(pullX * pullX + pullY * pullY);

    this.peelProgress = Math.min(1, pull / this.peelDistance);
    this.peelClipPath = this.calcClipPath(this.peelProgress);

    e.preventDefault();
  }

  onPeelEnd(_e: PointerEvent) {
    if (!this.dragging) return;
    this.dragging = false;

    if (this.peelProgress >= this.openThreshold) {
      this.openSticker();
      return;
    }

    this.peelProgress = 0;
    this.peelClipPath = this.calcClipPath(0);
    this.topStickerSrc = 'assets/img/header/skills/sticker.png';
  }

  onPeelCancel() {
    if (!this.dragging) return;
    this.dragging = false;

    this.peelProgress = 0;
    this.peelClipPath = this.calcClipPath(0);
    this.topStickerSrc = 'assets/img/header/skills/sticker.png';
  }

  private openSticker() {
    this.isOpen = true;
    this.peelProgress = 1;
    this.peelClipPath = this.calcClipPath(1);
  }

  resetSticker() {
    this.isOpen = false;
    this.peelProgress = 0;
    this.peelClipPath = this.calcClipPath(0);
    this.topStickerSrc = 'assets/img/header/skills/sticker.png';
  }

  private calcClipPath(progress: number): string {
    const overshoot = 100;
    const p = progress * (100 + overshoot);

    const x = 100 - p;
    const y = p;

    return `polygon(
    0% 0%,
    ${x}% 0%,
    100% ${y}%,
    100% 100%,
    0% 100%
  )`;
  }
}