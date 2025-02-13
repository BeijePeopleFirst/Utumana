import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAcceptRejectModalComponent } from './review-accept-reject-modal.component';

describe('ReviewAcceptRejectModalComponent', () => {
  let component: ReviewAcceptRejectModalComponent;
  let fixture: ComponentFixture<ReviewAcceptRejectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewAcceptRejectModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewAcceptRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
