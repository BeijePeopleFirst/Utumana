import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAvailabilitiesAccommodationDetailsComponent } from './edit-availabilities-accommodation-details.component';

describe('EditAvailabilitiesAccommodationDetailsComponent', () => {
  let component: EditAvailabilitiesAccommodationDetailsComponent;
  let fixture: ComponentFixture<EditAvailabilitiesAccommodationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAvailabilitiesAccommodationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAvailabilitiesAccommodationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
