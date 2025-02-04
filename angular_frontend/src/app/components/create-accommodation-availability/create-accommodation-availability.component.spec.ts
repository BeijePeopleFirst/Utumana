import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccommodationAvailabilityComponent } from './create-accommodation-availability.component';

describe('CreateAccommodationAvailabilityComponent', () => {
  let component: CreateAccommodationAvailabilityComponent;
  let fixture: ComponentFixture<CreateAccommodationAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccommodationAvailabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccommodationAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
