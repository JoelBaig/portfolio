import { Component, EventEmitter, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { AppBtnComponent } from '../app-btn/app-btn.component';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { ProjectDetailsComponent } from '../project-details/project-details.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    AppBtnComponent,
    AppHeadlineComponent,
    ProjectDetailsComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  @Output() projectModalOpenChange = new EventEmitter<boolean>();

  hoveredProject: string | null = null;
  openProject: string | null = null;

  projects = [
    {
      id: 'join',
      title: 'Join',
      description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users an categories.',
      image: './assets/img/header/projects/laptop2.png',
      hoverImg: './assets/img/header/projects/laptop1.png',
      alt: 'join_project'
    },
    {
      id: 'el-pollo-loco',
      title: 'El Pollo Loco',
      description: 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.',
      image: './assets/img/header/projects/elpolloloco1.png',
      hoverImg: './assets/img/header/projects/epl_hover.png',
      alt: 'game_project'
    },
    {
      id: 'da-bubble',
      title: 'DABubble',
      description: 'This App is a Slack Clone App. It revolutionizes team communication and collaboration with its intuitive interface, real-time messaging, and robust channel organization.',
      image: './assets/img/header/projects/dabubble1.png',
      hoverImg: './assets/img/header/projects/dabubble_hover.png',
      alt: 'dabubble_project'
    }
  ];

  openProjectDetails(projectId: string) {
    this.openProject = projectId;
    this.projectModalOpenChange.emit(true); 
  }

  closeProjectDetails() {
    this.openProject = null;
    this.projectModalOpenChange.emit(false); 
  }
}