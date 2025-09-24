// // import { Component, Input, Output, EventEmitter } from '@angular/core';
// // import { AppHeadlineComponent } from '../app-headline/app-headline.component';

// // @Component({
// //   selector: 'app-project-details',
// //   standalone: true,
// //   imports: [
// //     AppHeadlineComponent
// //   ],
// //   templateUrl: './project-details.component.html',
// //   styleUrl: './project-details.component.scss'
// // })
// // export class ProjectDetailsComponent {
// //   @Input() projectId!: string;
// //   @Output() close = new EventEmitter<void>();

// //   projects = [
// //     {
// //       id: 'join',
// //       title: 'Join',
// //       description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users an categories.',
// //       details: ' The project was developed in a team of three, which helped me gain valuable experience in collaborative coding, version control, and structured teamwork. My contributions included both front-end design with HTML/CSS and implementing core functionality with JavaScript and Firebase. This project strengthened my ability to work in an agile, team-oriented environment while focusing on clean and responsive user interfaces.',
// //       image: './assets/img/header/projects/laptop2.png',
// //       hoverImg: './assets/img/header/projects/laptop1.png',
// //       alt: 'join_project'
// //     },
// //     {
// //       id: 'el-pollo-loco',
// //       title: 'El Pollo Loco',
// //       description: 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.',
// //       details: ' The game was built to strengthen my understanding of object-oriented programming in JavaScript, while also applying clean structuring in HTML and CSS. I worked independently on this project, which allowed me to deepen both my coding fundamentals and my ability to design interactive game mechanics from scratch.',
// //       image: './assets/img/header/projects/elpolloloco1.png',
// //       hoverImg: './assets/img/header/projects/epl_hover.png',
// //       alt: 'game_project'
// //     },
// //     {
// //       id: 'da-bubble',
// //       title: 'DABubble',
// //       description: 'This App is a Slack Clone App. It revolutionizes team communication and collaboration with its intuitive interface, real-time messaging, and robust channel organization.',
// //       details: 'Built in a group of three, the project required us to combine Angular, TypeScript, and Firebase to create a scalable and responsive application with real-time chat functionality. I was actively involved in the front-end integration, ensuring smooth communication flows and user-friendly design. This project highlighted my ability to collaborate within a structured workflow while also contributing to complex, modern web application development.',
// //       image: './assets/img/header/projects/dabubble1.png',
// //       hoverImg: './assets/img/header/projects/dabubble_hover.png',
// //       alt: 'dabubble_project'
// //     }
// //   ];

// //   onClose() {
// //     this.close.emit();
// //   }
// // }

// import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
// import { AppHeadlineComponent } from '../app-headline/app-headline.component';
// import { NgIf } from '@angular/common';

// @Component({
//   selector: 'app-project-details',
//   standalone: true,
//   imports: [AppHeadlineComponent,
//   NgIf],
//   templateUrl: './project-details.component.html',
//   styleUrl: './project-details.component.scss'
// })
// export class ProjectDetailsComponent {
//   @Input() projectId!: string;
//   @Output() close = new EventEmitter<void>();

//   projectDetails = [
//     { id: 'join', title: 'Join',
//       description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users an categories.',
//       details: 'The project was developed in a team of three ... user interfaces.',
//       image: './assets/img/header/projects/laptop2.png',
//       alt: 'join_project'
//     },
//     { id: 'el-pollo-loco', title: 'El Pollo Loco',
//       description: 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.',
//       details: 'The game was built to strengthen my understanding of object-oriented programming ... mechanics from scratch.',
//       image: './assets/img/header/projects/elpolloloco1.png',
//       alt: 'game_project'
//     },
//     { id: 'da-bubble', title: 'DABubble',
//       description: 'This App is a Slack Clone App. It revolutionizes team communication and collaboration...',
//       details: 'Built in a group of three ... modern web application development.',
//       image: './assets/img/header/projects/dabubble1.png',
//       alt: 'dabubble_project'
//     }
//   ];

//   get selectedProject() {
//     return this.projects.find(p => p.id === this.projectId);
//   }

//   onClose() {
//     this.close.emit();
//   }

//   // @HostListener('document:keydown.escape')
//   // onEsc() { this.onClose(); }
// }


import { Component, Input, Output, EventEmitter, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { NgIf } from '@angular/common';

type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string;
  image: string;
  alt: string;
};

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [AppHeadlineComponent, NgIf],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})

export class ProjectDetailsComponent implements OnInit, OnDestroy {
  @Input() projectId!: string;
  @Output() close = new EventEmitter<void>();

  projectDetails: Project[] = [
    {
      id: 'join',
      title: 'Join',
      subtitle: 'Description',
      description:
        'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users an categories.',
      details:
        'The project was developed in a team of three ... user interfaces.',
      image: './assets/img/header/projects/laptop2.png',
      alt: 'join_project',
    },
    {
      id: 'el-pollo-loco',
      title: 'El Pollo Loco',
      subtitle: 'Description',
      description:
        'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.',
      details:
        'The game was built to strengthen my understanding of object-oriented programming ... mechanics from scratch.',
      image: './assets/img/header/projects/elpolloloco1.png',
      alt: 'game_project',
    },
    {
      id: 'da-bubble',
      title: 'DABubble',
      subtitle: 'Description',
      description:
        'This App is a Slack Clone App. It revolutionizes team communication and collaboration...',
      details:
        'Built in a group of three ... modern web application development.',
      image: './assets/img/header/projects/dabubble1.png',
      alt: 'dabubble_project',
    },
  ];

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private doc: Document
  ) { }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(e: KeyboardEvent) {
    e.preventDefault();
    this.onClose();
  }

  ngOnInit() {
    this.renderer.addClass(this.doc.body, 'no-scroll');
    this.renderer.addClass(this.doc.documentElement, 'no-scroll'); 
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.doc.body, 'no-scroll');
    this.renderer.removeClass(this.doc.documentElement, 'no-scroll');
  }

  get selectedProject(): Project | undefined {
    return this.projectDetails.find(p => p.id === this.projectId);
  }

  private get currentIndex(): number {
    return this.projectDetails.findIndex(p => p.id === this.projectId);
  }

  nextProject() {
    if (this.projectDetails.length === 0) return;

    const nextIndex = (this.currentIndex + 1) % this.projectDetails.length;
    this.projectId = this.projectDetails[nextIndex].id;
  }

  onClose() {
    this.close.emit();
  }
}