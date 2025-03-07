import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardProfileComponent } from './admin-dashboard-profile.component';

describe('AdminDashboardProfileComponent', () => {
  let component: AdminDashboardProfileComponent;
  let fixture: ComponentFixture<AdminDashboardProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
