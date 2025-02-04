import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccommodationRecapComponent } from './create-accommodation-recap.component';

describe('CreateAccommodationRecapComponent', () => {
  let component: CreateAccommodationRecapComponent;
  let fixture: ComponentFixture<CreateAccommodationRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccommodationRecapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccommodationRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
