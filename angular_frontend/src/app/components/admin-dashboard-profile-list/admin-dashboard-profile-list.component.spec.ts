import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardProfileListComponent } from './admin-dashboard-profile-list.component';

describe('AdminDashboardProfileListComponent', () => {
  let component: AdminDashboardProfileListComponent;
  let fixture: ComponentFixture<AdminDashboardProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardProfileListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
