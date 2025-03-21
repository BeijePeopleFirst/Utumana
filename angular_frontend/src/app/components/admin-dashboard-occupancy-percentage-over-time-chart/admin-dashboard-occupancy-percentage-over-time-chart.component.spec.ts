import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardOccupancyPercentageOverTimeChartComponent } from './admin-dashboard-occupancy-percentage-over-time-chart.component';

describe('AdminDashboardOccupancyPercentageOverTimeChartComponent', () => {
  let component: AdminDashboardOccupancyPercentageOverTimeChartComponent;
  let fixture: ComponentFixture<AdminDashboardOccupancyPercentageOverTimeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardOccupancyPercentageOverTimeChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardOccupancyPercentageOverTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
