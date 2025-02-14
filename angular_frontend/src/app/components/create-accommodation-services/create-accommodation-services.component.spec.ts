import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccommodationServicesComponent } from './create-accommodation-services.component';

describe('CreateAccommodationServicesComponent', () => {
  let component: CreateAccommodationServicesComponent;
  let fixture: ComponentFixture<CreateAccommodationServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccommodationServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccommodationServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
