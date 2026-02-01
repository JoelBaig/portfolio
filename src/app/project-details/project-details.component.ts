import { Component, Input, Output, EventEmitter, Inject, OnInit, OnDestroy, HostListener, DOCUMENT } from '@angular/core';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { AppBtnComponent } from '../app-btn/app-btn.component';
import { TranslateModule } from '@ngx-translate/core';

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
  githubUrl?: string;
  liveUrl?: string;
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
    TranslateModule
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
      description: 'PROJECTS.JOIN',
      details:
        'PROJECT_DETAILS.IMPLEMENT_TXT_JOIN',
      image: './assets/img/header/projects/join1.png',
      sticker: './assets/project_details/sticker_blue.png',
      used_technologies: [
        { name: 'HTML', icon: './assets/img/header/skills/html.png' },
        { name: 'CSS', icon: './assets/img/header/skills/css.png' },
        { name: 'JAVASCRIPT', icon: './assets/img/header/skills/js.png' },
        { name: 'FIREBASE', icon: './assets/img/header/skills/firebase.png' },
      ],
      duration: 'PROJECT_DETAILS.DURATION_TIME_JOIN',
      alt: 'join_project',
      githubUrl: 'https://github.com/mahapiri/join',
      liveUrl: 'https://join.joelbaig.com/'
    },
    {
      id: 'el-pollo-loco',
      title: 'El Pollo Loco',
      subtitle: 'Description',
      description: 'PROJECTS.EPL',
      details:
        'PROJECT_DETAILS.IMPLEMENT_TXT_EPL',
      image: './assets/img/header/projects/elpolloloco1.png',
      sticker: './assets/project_details/sticker_yellow.png',
      used_technologies: [
        { name: 'HTML', icon: './assets/img/header/skills/html.png' },
        { name: 'CSS', icon: './assets/img/header/skills/css.png' },
        { name: 'JAVASCRIPT', icon: './assets/img/header/skills/js.png' },
      ],
      duration: 'PROJECT_DETAILS.DURATION_TIME_EPL',
      alt: 'game_project',
      githubUrl: 'https://github.com/JoelBaig/epl_',
      liveUrl: 'https://elpolloloco.joelbaig.com/'
    },
    {
      id: 'da-bubble',
      title: 'DABubble',
      subtitle: 'Description',
      description: 'PROJECTS.DABUBBLE',
      details:
        'PROJECT_DETAILS.IMPLEMENT_TXT_DABUBBLE',
      image: './assets/img/header/projects/dabubble1.png',
      sticker: './assets/project_details/sticker_yellow.png',
      used_technologies: [
        { name: 'HTML', icon: './assets/img/header/skills/html.png' },
        { name: 'CSS', icon: './assets/img/header/skills/css.png' },
        { name: 'ANGULAR', icon: './assets/img/header/skills/angular.png' },
        { name: 'TYPESCRIPT', icon: './assets/img/header/skills/ts.png' },
      ],
      duration: 'PROJECT_DETAILS.DURATION_TIME_DABUBBLE',
      alt: 'dabubble_project',
      githubUrl: 'https://github.com/JoelBaig/epl_',
      liveUrl: 'https://elpolloloco.joelbaig.com/'
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

  openExternal(url?: string) {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}