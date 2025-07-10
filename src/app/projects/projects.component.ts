// import { Component } from '@angular/core';
// import { NgClass, NgFor } from '@angular/common';

// @Component({
//   selector: 'app-projects',
//   standalone: true,
//   imports: [NgClass, NgFor],
//   templateUrl: './projects.component.html',
//   styleUrl: './projects.component.scss'
// })
// export class ProjectsComponent {
//   animateLine = true;

//   projects = [
//     {
//       title: 'Join',
//       description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users an categories.',
//       image: './assets/img/header/projects/laptop2.png',
//       zoomImage: './assets/img/header/projects/laptop1.png',
//       zoomImageMax: './assets/img/header/projects/laptop3.png',
//       alt: 'join_project'
//     },
//     {
//       title: 'El Pollo Loco',
//       description: 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.',
//       image: './assets/img/header/projects/elpolloloco1.png',
//       zoomImage: './assets/img/header/projects/elpolloloco2.png',
//       alt: 'game_project'
//     },
//     {
//       title: 'DABubble',
//       description: 'This App is a Slack Clone App. It revolutionizes team communication and collaboration with its intuitive interface, real-time messaging, and robust channel organization.',
//       image: './assets/img/header/projects/dabubble1.png',
//       zoomImage: './assets/img/header/projects/dabubble2.png',
//       alt: 'dabubble_project'
//     }
//   ];

//   groupProjects(projects: any[]) {
//     const groups = [];
//     for (let i = 0; i < projects.length; i += 2) {
//       groups.push(projects.slice(i, i + 2));
//     }
//     return groups;
//   }
// }


import { Component } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgClass, NgFor],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  animateLine = true;

  projects = [
    {
      title: 'Join',
      description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users an categories.',
      image: './assets/img/header/projects/laptop2.png',
      alt: 'join_project'
    },
    {
      title: 'El Pollo Loco',
      description: 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.',
      image: './assets/img/header/projects/elpolloloco1.png',
      alt: 'game_project'
    },
    {
      title: 'DABubble',
      description: 'This App is a Slack Clone App. It revolutionizes team communication and collaboration with its intuitive interface, real-time messaging, and robust channel organization.',
      image: './assets/img/header/projects/dabubble1.png',
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
}