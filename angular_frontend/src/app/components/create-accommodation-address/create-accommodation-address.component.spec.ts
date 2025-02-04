import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccommodationAddressComponent } from './create-accommodation-address.component';

describe('CreateAccommodationAddressComponent', () => {
  let component: CreateAccommodationAddressComponent;
  let fixture: ComponentFixture<CreateAccommodationAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccommodationAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccommodationAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
