import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCardsComponent } from './booking-cards.component';

describe('BookingCardsComponent', () => {
  let component: BookingCardsComponent;
  let fixture: ComponentFixture<BookingCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
