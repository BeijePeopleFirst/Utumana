import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseBookPeriodFromAccDetailsComponent } from './choose-book-period-from-acc-details.component';

describe('ChooseBookPeriodFromAccDetailsComponent', () => {
  let component: ChooseBookPeriodFromAccDetailsComponent;
  let fixture: ComponentFixture<ChooseBookPeriodFromAccDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseBookPeriodFromAccDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseBookPeriodFromAccDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
