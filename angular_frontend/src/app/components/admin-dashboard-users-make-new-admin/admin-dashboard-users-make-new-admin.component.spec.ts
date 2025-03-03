import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardUsersMakeNewAdminComponent } from './admin-dashboard-users-make-new-admin.component';

describe('AdminDashboardUsersMakeNewAdminComponent', () => {
  let component: AdminDashboardUsersMakeNewAdminComponent;
  let fixture: ComponentFixture<AdminDashboardUsersMakeNewAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardUsersMakeNewAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardUsersMakeNewAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
