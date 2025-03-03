import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhotosAccommodationDetailsComponent } from './edit-photos-accommodation-details.component';

describe('EditPhotosAccommodationDetailsComponent', () => {
  let component: EditPhotosAccommodationDetailsComponent;
  let fixture: ComponentFixture<EditPhotosAccommodationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPhotosAccommodationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPhotosAccommodationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
