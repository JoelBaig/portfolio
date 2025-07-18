import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHeadlineComponent } from './app-headline.component';

describe('AppHeadlineComponent', () => {
  let component: AppHeadlineComponent;
  let fixture: ComponentFixture<AppHeadlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeadlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppHeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
