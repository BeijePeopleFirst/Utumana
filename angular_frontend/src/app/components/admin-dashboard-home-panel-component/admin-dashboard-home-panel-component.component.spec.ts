import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardHomePanelComponentComponent } from './admin-dashboard-home-panel-component.component';

describe('AdminDashboardHomePanelComponentComponent', () => {
  let component: AdminDashboardHomePanelComponentComponent;
  let fixture: ComponentFixture<AdminDashboardHomePanelComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardHomePanelComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardHomePanelComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
