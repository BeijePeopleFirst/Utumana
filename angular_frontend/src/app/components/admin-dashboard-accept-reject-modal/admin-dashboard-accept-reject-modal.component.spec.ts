import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardAcceptRejectModalComponent } from './admin-dashboard-accept-reject-modal.component';

describe('AdminDashboardAcceptRejectModalComponent', () => {
  let component: AdminDashboardAcceptRejectModalComponent;
  let fixture: ComponentFixture<AdminDashboardAcceptRejectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardAcceptRejectModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardAcceptRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
