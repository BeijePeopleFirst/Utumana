import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardMainAndSidenavComponent } from './admin-dashboard-main-and-sidenav.component';

describe('AdminDashboardMainAndSidenavComponent', () => {
  let component: AdminDashboardMainAndSidenavComponent;
  let fixture: ComponentFixture<AdminDashboardMainAndSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardMainAndSidenavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardMainAndSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
