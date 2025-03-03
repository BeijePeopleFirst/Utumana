import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardAccetRejectComponent } from './admin-dashboard-accet-reject.component';

describe('AdminDashboardAccetRejectComponent', () => {
  let component: AdminDashboardAccetRejectComponent;
  let fixture: ComponentFixture<AdminDashboardAccetRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardAccetRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardAccetRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
