import { Component, EventEmitter, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { AppBtnComponent } from '../app-btn/app-btn.component';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { ProjectDetailsComponent } from '../project-details/project-details.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    AppBtnComponent,
    AppHeadlineComponent,
    ProjectDetailsComponent,
    TranslateModule
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
      description: 'PROJECTS.JOIN',
      image: './assets/img/header/projects/laptop2.png',
      hoverImg: './assets/img/header/projects/laptop1.png',
      alt: 'join_project'
    },
    {
      id: 'el-pollo-loco',
      title: 'El Pollo Loco',
      description: 'PROJECTS.EPL',
      image: './assets/img/header/projects/elpolloloco1.png',
      hoverImg: './assets/img/header/projects/epl_hover.png',
      alt: 'game_project'
    },
    {
      id: 'da-bubble',
      title: 'DABubble',
      description: 'PROJECTS.DABUBBLE',
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