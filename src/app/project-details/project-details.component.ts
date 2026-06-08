import { Component, Input, Output, EventEmitter, Inject, OnInit, OnDestroy, HostListener, DOCUMENT } from '@angular/core';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { AppBtnComponent } from '../app-btn/app-btn.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Represents a single portfolio project shown in the details view.
 */
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
  hidden?: boolean;
};

/**
 * Displays detailed information about a selected project,
 * handles project navigation and manages scroll blocking
 * while the details view is open.
 */
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

  private wheelHandler = (e: Event) => e.preventDefault();
  private touchMoveHandler = (e: Event) => e.preventDefault();

  private keydownHandler = (e: KeyboardEvent) => {
    if (this.isEditableTarget(e.target)) return;
    if (this.isBlockedKey(e.key)) e.preventDefault();
  };

  projectDetails: Project[] = [
    {
      id: 'join',
      title: 'Join',
      subtitle: 'Description',
      description: 'PROJECTS.JOIN',
      details: 'PROJECT_DETAILS.IMPLEMENT_TXT_JOIN',
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
      githubUrl: 'https://github.com/JoelBaig/join-kanban',
      liveUrl: 'https://join.joelbaig.com/'
    },
    {
      id: 'el-pollo-loco',
      title: 'El Pollo Loco',
      subtitle: 'Description',
      description: 'PROJECTS.EPL',
      details: 'PROJECT_DETAILS.IMPLEMENT_TXT_EPL',
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
      details: 'PROJECT_DETAILS.IMPLEMENT_TXT_DABUBBLE',
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
      liveUrl: 'https://elpolloloco.joelbaig.com/',
      hidden: true
    },
  ];

  constructor(@Inject(DOCUMENT) private doc: Document) { }

  /**
   * Handles the Escape key and closes the project details view.
   *
   * @param event The keyboard event.
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: Event): void {
    event.preventDefault();
    this.onClose();
  }

  /**
   * Initializes scroll blocking when the details view is opened.
   */
  ngOnInit(): void {
    this.addNoScrollClasses();
    this.addScrollBlockListeners();
  }

  /**
   * Restores normal scroll behavior when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.removeScrollBlockListeners();
    this.removeNoScrollClasses();
  }

  /**
   * Returns the currently selected project.
   *
   * @returns The selected project or undefined if no project matches the id.
   */
  get selectedProject(): Project | undefined {
    return this.projectDetails.find(p => p.id === this.projectId);
  }

  /**
   * Returns the index of the currently selected project.
   *
   * @returns The current project index.
   */
  private get currentIndex(): number {
    return this.projectDetails.findIndex(p => p.id === this.projectId);
  }

  /**
   * Switches to the next project in the project list.
   */
  nextProject(): void {
    const visibleProjects = this.projectDetails.filter(project => !project.hidden);
    const currentVisibleIndex = visibleProjects.findIndex(project => project.id === this.projectId);

    if (visibleProjects.length === 0) return;

    const nextIndex = (currentVisibleIndex + 1) % visibleProjects.length;
    this.projectId = visibleProjects[nextIndex].id;
  }

  /**
   * Calculates the next project index.
   *
   * @returns The next project index.
   */
  private getNextIndex(): number {
    return (this.currentIndex + 1) % this.projectDetails.length;
  }

  /**
   * Emits the close event to close the details view.
   */
  onClose(): void {
    this.close.emit();
  }

  /**
   * Handles navbar clicks inside the details view.
   *
   * @param e The mouse event triggered by the navbar click.
   */
  onNavbarClick(e: MouseEvent): void {
    const linkElem = this.getClickedNavElement(e);

    if (linkElem && this.isAllowedNavElement(linkElem)) {
      this.onClose();
      return;
    }

    e.stopPropagation();
  }

  /**
   * Opens an external project link in a new browser tab.
   *
   * @param url The external URL to open.
   */
  openExternal(url?: string): void {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Toggles the mobile box shadow depending on the viewport width.
   */
  toggleMobileBoxShadow(): void {
    const mobileBoxShadow = document.getElementById('mobileBoxShadow');
    if (!mobileBoxShadow) return;
    this.updateMobileBoxShadow(mobileBoxShadow);
  }

  /**
   * Closes the project details view and scrolls to a page section afterward.
   *
   * @param fragment The id of the target section.
   */
  closeProjectDetails(fragment: string): void {
    this.removeScrollBlockListeners();
    this.resetDocumentAfterClose();
    this.close.emit();
    this.scrollToFragmentAfterClose(fragment);
  }

  /**
   * Adds scroll-lock classes to the document.
   */
  private addNoScrollClasses(): void {
    this.doc.body.classList.add('no-scroll');
    this.doc.documentElement.classList.add('no-scroll');
  }

  /**
   * Removes scroll-lock classes from the document.
   */
  private removeNoScrollClasses(): void {
    this.doc.body.classList.remove('no-scroll');
    this.doc.documentElement.classList.remove('no-scroll');
  }

  /**
   * Adds listeners that prevent background scrolling.
   * On mobile the project details panel itself should remain scrollable.
   */
  private addScrollBlockListeners(): void {
    if (window.innerWidth <= 900) {
      window.addEventListener('keydown', this.keydownHandler, { passive: false });
      return;
    }

    window.addEventListener('wheel', this.wheelHandler, { passive: false });
    window.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
    window.addEventListener('keydown', this.keydownHandler, { passive: false });
  }

  /**
   * Removes all scroll blocking listeners.
   */
  private removeScrollBlockListeners(): void {
    window.removeEventListener('wheel', this.wheelHandler as EventListener);
    window.removeEventListener('touchmove', this.touchMoveHandler as EventListener);
    window.removeEventListener('keydown', this.keydownHandler as EventListener);
  }

  /**
   * Checks whether the event target is an editable element.
   *
   * @param target The event target to check.
   * @returns True if the target is editable.
   */
  private isEditableTarget(target: EventTarget | null): boolean {
    const el = target as HTMLElement | null;
    const tag = el?.tagName?.toLowerCase();
    return tag === 'input' || tag === 'textarea' || !!el?.isContentEditable;
  }

  /**
   * Checks whether a pressed key should be blocked from scrolling.
   *
   * @param key The pressed keyboard key.
   * @returns True if the key should be blocked.
   */
  private isBlockedKey(key: string): boolean {
    return [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'PageUp',
      'PageDown',
      'Home',
      'End',
      ' '
    ].includes(key);
  }

  /**
   * Returns the clicked navbar element if the event target is inside one.
   *
   * @param e The mouse event.
   * @returns The matching navigation element or null.
   */
  private getClickedNavElement(e: MouseEvent): HTMLElement | null {
    const target = e.target as HTMLElement | null;
    return target?.closest('a, [data-nav], [role="link"], button') as HTMLElement | null;
  }

  /**
   * Checks whether a clicked navigation element points to an allowed section.
   *
   * @param element The clicked navigation element.
   * @returns True if the element points to an allowed section.
   */
  private isAllowedNavElement(element: HTMLElement): boolean {
    const content = this.getNavElementContent(element);
    return /(about|skills|projects|contact|top)/i.test(content);
  }

  /**
   * Collects relevant navigation content from an element.
   *
   * @param element The navigation element.
   * @returns A combined string containing href, data-nav and text content.
   */
  private getNavElementContent(element: HTMLElement): string {
    const href = (element as HTMLAnchorElement).getAttribute?.('href') ?? '';
    const dataNav = element.getAttribute?.('data-nav') ?? '';
    const text = (element.textContent ?? '').trim();
    return `${href} ${dataNav} ${text}`;
  }

  /**
   * Updates the mobile box shadow visibility based on the viewport width.
   *
   * @param element The mobile box shadow element.
   */
  private updateMobileBoxShadow(element: HTMLElement): void {
    if (window.innerWidth <= 900) {
      element.classList.remove('d-none');
      return;
    }

    element.classList.add('d-none');
  }

  /**
   * Restores document classes and inline styles after closing the details view.
   */
  private resetDocumentAfterClose(): void {
    this.removeBodyCloseClasses();
    this.removeHtmlCloseClasses();
    this.resetBodyStyles();
    this.resetHtmlStyles();
  }

  /**
   * Removes close-related classes from the body element.
   */
  private removeBodyCloseClasses(): void {
    this.doc.body.classList.remove('no-scroll', 'menu-open', 'd-none');
  }

  /**
   * Removes close-related classes from the html element.
   */
  private removeHtmlCloseClasses(): void {
    this.doc.documentElement.classList.remove('no-scroll');
  }

  /**
   * Resets inline styles applied to the body element.
   */
  private resetBodyStyles(): void {
    this.doc.body.style.position = '';
    this.doc.body.style.top = '';
    this.doc.body.style.left = '';
    this.doc.body.style.right = '';
    this.doc.body.style.width = '';
    this.doc.body.style.overflow = '';
  }

  /**
   * Resets inline styles applied to the html element.
   */
  private resetHtmlStyles(): void {
    this.doc.documentElement.style.overflow = '';
  }

  /**
   * Scrolls to a page section after the details view has closed.
   *
   * @param fragment The target section id.
   */
  private scrollToFragmentAfterClose(fragment: string): void {
    requestAnimationFrame(() => {
      setTimeout(() => this.scrollToFragment(fragment), 120);
    });
  }

  /**
   * Scrolls smoothly to the given page section.
   *
   * @param fragment The target section id.
   */
  private scrollToFragment(fragment: string): void {
    if (this.isTopFragment(fragment)) {
      this.scrollToPageTop();
      return;
    }

    this.scrollToElement(fragment);
  }

  /**
   * Checks whether the target fragment points to the page top.
   *
   * @param fragment The fragment to check.
   * @returns True if the fragment points to the page top.
   */
  private isTopFragment(fragment: string): boolean {
    return fragment === 'top';
  }

  /**
   * Scrolls smoothly to the top of the page.
   */
  private scrollToPageTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Scrolls smoothly to an element by id.
   *
   * @param fragment The id of the target element.
   */
  private scrollToElement(fragment: string): void {
    const target = document.getElementById(fragment);
    if (!target) return;

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}