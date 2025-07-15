import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { AppBtnComponent } from '../app-btn/app-btn.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    AppBtnComponent,
    NgIf
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})

export class ProjectsComponent {
  animateLine = true;
  hoveredProject: string | null = null;
  zoomedProject: string | null = null;

  projects = [
    {
      title: 'Join',
      description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users an categories.',
      image: './assets/img/header/projects/laptop2.png',
      hoverImg: './assets/img/header/projects/laptop1.png',
      alt: 'join_project'
    },
    {
      title: 'El Pollo Loco',
      description: 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.',
      image: './assets/img/header/projects/elpolloloco1.png',
      hoverImg: './assets/img/header/projects/epl_hover.png',
      alt: 'game_project'
    },
    {
      title: 'DABubble',
      description: 'This App is a Slack Clone App. It revolutionizes team communication and collaboration with its intuitive interface, real-time messaging, and robust channel organization.',
      image: './assets/img/header/projects/dabubble1.png',
      hoverImg: './assets/img/header/projects/dabubble_hover.png',
      alt: 'dabubble_project'
    }
  ];

  groupProjects(projects: any[]) {
    const groups = [];
    for (let i = 0; i < projects.length; i += 2) {
      groups.push(projects.slice(i, i + 2));
    }
    return groups;
  }

  showButton(projectTitle: string) {
    this.hoveredProject = projectTitle;
  }

  hideButton(projectTitle: string) {
    this.hoveredProject = null;
  }
}