import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccommodationConfirmModalComponent } from './create-accommodation-confirm-modal.component';

describe('CreateAccommodationConfirmModalComponent', () => {
  let component: CreateAccommodationConfirmModalComponent;
  let fixture: ComponentFixture<CreateAccommodationConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccommodationConfirmModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccommodationConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
