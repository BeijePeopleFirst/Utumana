import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardAccommodationAllComponent } from './admin-dashboard-accommodation-all.component';

describe('AdminDashboardAccommodationAllComponent', () => {
  let component: AdminDashboardAccommodationAllComponent;
  let fixture: ComponentFixture<AdminDashboardAccommodationAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardAccommodationAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardAccommodationAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
