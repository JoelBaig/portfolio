// import { Component, Input, Output, EventEmitter, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
// import { DOCUMENT } from '@angular/common';
// import { AppHeadlineComponent } from '../app-headline/app-headline.component';
// import { NgIf } from '@angular/common';

// type Project = {
//   id: string;
//   title: string;
//   subtitle: string;
//   description: string;
//   details: string;
//   image: string;
//   alt: string;
// };

// @Component({
//   selector: 'app-project-details',
//   standalone: true,
//   imports: [AppHeadlineComponent, NgIf],
//   templateUrl: './project-details.component.html',
//   styleUrl: './project-details.component.scss'
// })
// export class ProjectDetailsComponent implements OnInit, OnDestroy {
//   @Input() projectId!: string;
//   @Output() close = new EventEmitter<void>();

//   projectDetails: Project[] = [
//     {
//       id: 'join',
//       title: 'Join',
//       subtitle: 'Description',
//       description:
//         'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users an categories.',
//       details:
//         'The project was developed in a team of three ... user interfaces.',
//       image: './assets/img/header/projects/laptop2.png',
//       alt: 'join_project',
//     },
//     {
//       id: 'el-pollo-loco',
//       title: 'El Pollo Loco',
//       subtitle: 'Description',
//       description:
//         'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.',
//       details:
//         'The game was built to strengthen my understanding of object-oriented programming ... mechanics from scratch.',
//       image: './assets/img/header/projects/elpolloloco1.png',
//       alt: 'game_project',
//     },
//     {
//       id: 'da-bubble',
//       title: 'DABubble',
//       subtitle: 'Description',
//       description:
//         'This App is a Slack Clone App. It revolutionizes team communication and collaboration...',
//       details:
//         'Built in a group of three ... modern web application development.',
//       image: './assets/img/header/projects/dabubble1.png',
//       alt: 'dabubble_project',
//     },
//   ];

//   constructor(@Inject(DOCUMENT) private doc: Document) {}

//   @HostListener('document:keydown.escape', ['$event'])
//   onEsc(e: KeyboardEvent) {
//     e.preventDefault();
//     this.onClose();
//   }

//   ngOnInit() {
//     this.doc.body.classList.add('no-scroll');
//     this.doc.documentElement.classList.add('no-scroll');
//   }

//   ngOnDestroy() {
//     this.doc.body.classList.remove('no-scroll');
//     this.doc.documentElement.classList.remove('no-scroll');
//   }

//   get selectedProject(): Project | undefined {
//     return this.projectDetails.find(p => p.id === this.projectId);
//   }

//   private get currentIndex(): number {
//     return this.projectDetails.findIndex(p => p.id === this.projectId);
//   }

//   nextProject() {
//     if (this.projectDetails.length === 0) return;
//     const nextIndex = (this.currentIndex + 1) % this.projectDetails.length;
//     this.projectId = this.projectDetails[nextIndex].id;
//   }

//   onClose() {
//     this.close.emit();
//   }
// }




import { Component, Input, Output, EventEmitter, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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

  // keine fixed-/top-Lösung mehr => kein Sprung
  // wir sperren Scroll rein per overflow hidden + Event-Blocker (wheel/touch/key)

  private wheelHandler = (e: Event) => { e.preventDefault(); };
  private touchMoveHandler = (e: Event) => { e.preventDefault(); };
  private keydownHandler = (e: KeyboardEvent) => {
    // Scroll-Tasten blockieren, außer in Eingabefeldern
    const target = e.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    const editable = tag === 'input' || tag === 'textarea' || target?.isContentEditable;
    if (editable) return;

    const keys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','PageUp','PageDown','Home','End',' '];
    if (keys.includes(e.key)) e.preventDefault();
  };

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

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(e: KeyboardEvent) {
    e.preventDefault();
    this.onClose();
  }

  ngOnInit() {
    // 1) Scroll global sperren – ohne Layout-Shift, ohne Positionsänderung
    this.doc.body.classList.add('no-scroll');
    this.doc.documentElement.classList.add('no-scroll');

    // 2) Scroll-Events komplett blocken (verhindert Scroll-Chaining & Panel-Scroll)
    window.addEventListener('wheel', this.wheelHandler, { passive: false });
    window.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
    window.addEventListener('keydown', this.keydownHandler, { passive: false });
  }

  ngOnDestroy() {
    // 3) Event-Blocker entfernen & Scroll wieder erlauben
    window.removeEventListener('wheel', this.wheelHandler as EventListener);
    window.removeEventListener('touchmove', this.touchMoveHandler as EventListener);
    window.removeEventListener('keydown', this.keydownHandler as EventListener);

    this.doc.body.classList.remove('no-scroll');
    this.doc.documentElement.classList.remove('no-scroll');

    // Wichtig: KEIN window.scrollTo(...) – dadurch entsteht auch kein sichtbarer "hoch → runter"-Effekt
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