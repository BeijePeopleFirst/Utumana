import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardAccommodationInactiveComponent } from './admin-dashboard-accommodation-inactive.component';

describe('AdminDashboardAccommodationInactiveComponent', () => {
  let component: AdminDashboardAccommodationInactiveComponent;
  let fixture: ComponentFixture<AdminDashboardAccommodationInactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardAccommodationInactiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardAccommodationInactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
