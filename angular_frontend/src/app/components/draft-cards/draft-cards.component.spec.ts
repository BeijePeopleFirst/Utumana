import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftCardsComponent } from './draft-cards.component';

describe('DraftCardsComponent', () => {
  let component: DraftCardsComponent;
  let fixture: ComponentFixture<DraftCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraftCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
