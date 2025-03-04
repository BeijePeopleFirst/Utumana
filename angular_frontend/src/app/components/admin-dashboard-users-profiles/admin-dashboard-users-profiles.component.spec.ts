import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardUsersProfilesComponent } from './admin-dashboard-users-profiles.component';

describe('AdminDashboardUsersProfilesComponent', () => {
  let component: AdminDashboardUsersProfilesComponent;
  let fixture: ComponentFixture<AdminDashboardUsersProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardUsersProfilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardUsersProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
