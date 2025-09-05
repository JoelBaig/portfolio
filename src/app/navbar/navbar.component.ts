import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  isHovered = {
    about: false,
    skills: false,
    projects: false,
    contact: false
  };

  triggerLinkHoverEffect(link: keyof typeof this.isHovered) {
    this.isHovered[link] = true;
  }

  removeLinkHoverEffect(link: keyof typeof this.isHovered) {
    this.isHovered[link] = false;
  }
}
