import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBookingBooknowComponent } from './confirm-booking-booknow.component';

describe('ConfirmBookingBooknowComponent', () => {
  let component: ConfirmBookingBooknowComponent;
  let fixture: ComponentFixture<ConfirmBookingBooknowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmBookingBooknowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmBookingBooknowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
