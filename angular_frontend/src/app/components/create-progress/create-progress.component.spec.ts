import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProgressComponent } from './create-progress.component';

describe('CreateProgressComponent', () => {
  let component: CreateProgressComponent;
  let fixture: ComponentFixture<CreateProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
