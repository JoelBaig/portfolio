import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

type RevealDir = 'up' | 'down' | 'left' | 'right';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() revealDir: RevealDir = 'up';
  @Input() revealDistance = 24;     
  @Input() revealDelay = 0;        
  @Input() revealOnce = true;       

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const node = this.el.nativeElement;


  }

  ngOnDestroy(): void {

  }

  private dirClass(dir: RevealDir): string {
    switch (dir) {
      case 'left': return 'from-left';
      case 'right': return 'from-right';
      case 'down': return 'from-down';
      default: return 'from-up';
    }
  }
}