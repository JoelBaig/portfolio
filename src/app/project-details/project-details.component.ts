import { Component, Input, Output, EventEmitter, Inject, OnInit, OnDestroy, HostListener, DOCUMENT } from '@angular/core';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { AppBtnComponent } from '../app-btn/app-btn.component';

type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string;
  image: string;
  sticker: string;
  alt: string;
  used_technologies: { name: string; icon: string }[];
  duration: string;
};

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    AppHeadlineComponent,
    NavbarComponent,
    AppBtnComponent,
    NgIf,
    NgForOf,
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  @Input() projectId!: string;
  @Output() close = new EventEmitter<void>();

  private wheelHandler = (e: Event) => { e.preventDefault(); };
  private touchMoveHandler = (e: Event) => { e.preventDefault(); };
  private keydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    const editable = tag === 'input' || tag === 'textarea' || target?.isContentEditable;
    if (editable) return;

    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' '];
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
      image: './assets/img/header/projects/join1.png',
      sticker: './assets/project_details/sticker_blue.png',
      used_technologies: [
        { name: 'HTML', icon: './assets/img/header/skills/html.png' },
        { name: 'CSS', icon: './assets/img/header/skills/css.png' },
        { name: 'JAVASCRIPT', icon: './assets/img/header/skills/js.png' },
        { name: 'FIREBASE', icon: './assets/img/header/skills/firebase.png' },
      ],
      duration: '5 weeks',
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
      sticker: './assets/project_details/sticker_yellow.png',
      used_technologies: [
        { name: 'HTML', icon: './assets/img/header/skills/html.png' },
        { name: 'CSS', icon: './assets/img/header/skills/css.png' },
        { name: 'JAVASCRIPT', icon: './assets/img/header/skills/js.png' },
      ],
      duration: '3 weeks',
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
      sticker: './assets/project_details/sticker_yellow.png',
      used_technologies: [
        { name: 'HTML', icon: './assets/img/header/skills/html.png' },
        { name: 'CSS', icon: './assets/img/header/skills/css.png' },
        { name: 'ANGULAR', icon: './assets/img/header/skills/angular.png' },
        { name: 'TYPESCRIPT', icon: './assets/img/header/skills/ts.png' },
      ],
      duration: '4 weeks',
      alt: 'dabubble_project',
    },
  ];

  constructor(@Inject(DOCUMENT) private doc: Document) { }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: Event) {
    event.preventDefault();
    const e = event as KeyboardEvent;
    this.onClose();
  }

  ngOnInit() {
    this.doc.body.classList.add('no-scroll');
    this.doc.documentElement.classList.add('no-scroll');
    window.addEventListener('wheel', this.wheelHandler, { passive: false });
    window.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
    window.addEventListener('keydown', this.keydownHandler, { passive: false });
  }

  ngOnDestroy() {
    window.removeEventListener('wheel', this.wheelHandler as EventListener);
    window.removeEventListener('touchmove', this.touchMoveHandler as EventListener);
    window.removeEventListener('keydown', this.keydownHandler as EventListener);
    this.doc.body.classList.remove('no-scroll');
    this.doc.documentElement.classList.remove('no-scroll');
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

  onNavbarClick(e: MouseEvent): void {
    const target = e.target as HTMLElement | null;
    const linkElem = target?.closest('a, [data-nav], [role="link"], button') as HTMLElement | null;

    if (linkElem) {
      const href = (linkElem as HTMLAnchorElement).getAttribute?.('href') ?? '';
      const dataNav = linkElem.getAttribute?.('data-nav') ?? '';
      const text = (linkElem.textContent ?? '').trim();
      const allowedRegex = /(about|skills|projects|contact)/i;
      const isAllowed = allowedRegex.test(href) || allowedRegex.test(dataNav) || allowedRegex.test(text);

      if (isAllowed) {
        this.onClose();
        return;
      }
    }
    e.stopPropagation();
  }
}