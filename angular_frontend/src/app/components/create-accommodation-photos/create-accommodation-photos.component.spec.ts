import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccommodationPhotosComponent } from './create-accommodation-photos.component';

describe('CreateAccommodationPhotosComponent', () => {
  let component: CreateAccommodationPhotosComponent;
  let fixture: ComponentFixture<CreateAccommodationPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccommodationPhotosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccommodationPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
