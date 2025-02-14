import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationCardsComponent } from './accommodation-cards.component';

describe('AccommodationCardsComponent', () => {
  let component: AccommodationCardsComponent;
  let fixture: ComponentFixture<AccommodationCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccommodationCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccommodationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
