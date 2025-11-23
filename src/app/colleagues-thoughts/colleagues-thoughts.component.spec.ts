import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColleaguesThoughtsComponent } from './colleagues-thoughts.component';

describe('ColleaguesThoughtsComponent', () => {
  let component: ColleaguesThoughtsComponent;
  let fixture: ComponentFixture<ColleaguesThoughtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColleaguesThoughtsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColleaguesThoughtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
