import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardAccommodationActiveComponent } from './admin-dashboard-accommodation-active.component';

describe('AdminDashboardAccommodationActiveComponent', () => {
  let component: AdminDashboardAccommodationActiveComponent;
  let fixture: ComponentFixture<AdminDashboardAccommodationActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardAccommodationActiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardAccommodationActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
