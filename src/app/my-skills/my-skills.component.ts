import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Displays the skills section including the interactive
 * peelable sticker animation and technology overview.
 */
@Component({
  selector: 'app-my-skills',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, TranslateModule],
  templateUrl: './my-skills.component.html',
  styleUrl: './my-skills.component.scss'
})
export class MySkillsComponent {
  skills = [
    { name: 'HTML', src: './assets/img/header/skills/html.png' },
    { name: 'CSS', src: './assets/img/header/skills/css.png' },
    { name: 'JavaScript', src: './assets/img/header/skills/js.png' },
    { name: 'TypeScript', src: './assets/img/header/skills/ts.png' },
    { name: 'Angular', src: './assets/img/header/skills/angular.png' },
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

  /**
   * Updates the top sticker image when the user hovers over it.
   *
   * @param hovered Indicates whether the sticker is currently hovered.
   */
  onTopHover(hovered: boolean): void {
    if (this.isOpen || this.dragging) return;

    this.topStickerSrc = hovered
      ? 'assets/img/header/skills/sticker_hover.png'
      : 'assets/img/header/skills/sticker.png';
  }

  /**
   * Starts the peel interaction and stores the initial pointer position.
   *
   * @param e The pointer event used to start dragging.
   */
  onPeelStart(e: PointerEvent): void {
    if (this.isOpen) return;

    this.dragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.topStickerSrc = 'assets/img/header/skills/sticker_hover.png';
    e.preventDefault();
  }

  /**
   * Updates the peel progress while the user drags the sticker.
   *
   * @param e The pointer event used during dragging.
   */
  onPeelMove(e: PointerEvent): void {
    if (!this.dragging || this.isOpen) return;

    const pull = this.getPullDistance(e);
    this.peelProgress = Math.min(1, pull / this.peelDistance);
    this.peelClipPath = this.calcClipPath(this.peelProgress);

    e.preventDefault();
  }

  /**
   * Ends the peel interaction and either opens or resets the sticker.
   *
   * @param _e The pointer event used to end dragging.
   */
  onPeelEnd(_e: PointerEvent): void {
    if (!this.checkDragging()) return;
    if (this.checkPeeling()) return;

    this.resetPeelState();
  }

  /**
   * Cancels the current peel interaction and restores the initial sticker state.
   */
  onPeelCancel(): void {
    if (!this.dragging) return;

    this.dragging = false;
    this.resetPeelState();
  }

  /**
   * Resets the sticker and closes the expanded view.
   */
  resetSticker(): void {
    this.isOpen = false;
    this.resetPeelState();
  }

  /**
   * Calculates the current pull distance from the initial pointer position.
   *
   * @param e The pointer event used during dragging.
   * @returns The calculated pull distance.
   */
  private getPullDistance(e: PointerEvent): number {
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const pullX = Math.max(0, -dx);
    const pullY = Math.max(0, dy);

    return Math.sqrt(pullX * pullX + pullY * pullY);
  }

  /**
   * Verifies that a drag operation is currently active.
   *
   * @returns True if dragging was active.
   */
  private checkDragging(): boolean {
    if (!this.dragging) return false;

    this.dragging = false;
    return true;
  }

  /**
   * Checks whether the sticker has been peeled far enough to open.
   *
   * @returns True if the sticker was opened.
   */
  private checkPeeling(): boolean {
    if (this.peelProgress >= this.openThreshold) {
      this.openSticker();
      return true;
    }

    return false;
  }

  /**
   * Resets the peel animation values to their initial state.
   */
  private resetPeelState(): void {
    this.peelProgress = 0;
    this.peelClipPath = this.calcClipPath(0);
    this.topStickerSrc = 'assets/img/header/skills/sticker.png';
  }

  /**
   * Opens the sticker when the user clicks it.
   */
  openStickerByClick(): void {
    if (this.isOpen || this.dragging) return;

    this.openSticker();
  }

  /**
   * Opens the sticker and reveals the hidden technologies.
   */
  private openSticker(): void {
    this.isOpen = true;
    this.dragging = false;
    this.peelProgress = 1;
    this.peelClipPath = this.calcClipPath(1);
  }

  /**
   * Calculates the clip-path used for the peel animation.
   *
   * @param progress The current peel progress.
   * @returns A CSS clip-path string.
   */
  private calcClipPath(progress: number): string {
    const { x, y } = this.calculatePeelValues(progress);
    return this.buildClipPath(x, y);
  }

  /**
   * Calculates the x and y values used for the clip-path polygon.
   *
   * @param progress The current peel progress.
   * @returns The calculated peel coordinates.
   */
  private calculatePeelValues(progress: number): { x: number; y: number } {
    const overshoot = 100;
    const p = progress * (100 + overshoot);

    return {
      x: 100 - p,
      y: p
    };
  }

  /**
   * Builds the polygon clip-path string from the given coordinates.
   *
   * @param x The horizontal peel coordinate.
   * @param y The vertical peel coordinate.
   * @returns A CSS polygon clip-path.
   */
  private buildClipPath(x: number, y: number): string {
    return `polygon(
    0% 0%,
    ${x}% 0%,
    100% ${y}%,
    100% 100%,
    0% 100%
  )`;
  }
}