import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardAcceptRejectComponent } from './admin-dashboard-accept-reject.component';

describe('AdminDashboardAcceptRejectComponent', () => {
  let component: AdminDashboardAcceptRejectComponent;
  let fixture: ComponentFixture<AdminDashboardAcceptRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardAcceptRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardAcceptRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
