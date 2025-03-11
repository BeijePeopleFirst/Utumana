import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardCustomizeComponent } from './admin-dashboard-customize.component';

describe('AdminDashboardCustomizeComponent', () => {
  let component: AdminDashboardCustomizeComponent;
  let fixture: ComponentFixture<AdminDashboardCustomizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardCustomizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardCustomizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
