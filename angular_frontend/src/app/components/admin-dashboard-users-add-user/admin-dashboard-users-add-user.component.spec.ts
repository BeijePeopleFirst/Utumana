import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardUsersAddUserComponent } from './admin-dashboard-users-add-user.component';

describe('AdminDashboardUsersAddUserComponent', () => {
  let component: AdminDashboardUsersAddUserComponent;
  let fixture: ComponentFixture<AdminDashboardUsersAddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardUsersAddUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardUsersAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
