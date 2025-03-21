import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardAveragePriceOverTimeLineChartComponent } from './admin-dashboard-average-price-over-time-line-chart.component';

describe('AdminDashboardAveragePriceOverTimeLineChartComponent', () => {
  let component: AdminDashboardAveragePriceOverTimeLineChartComponent;
  let fixture: ComponentFixture<AdminDashboardAveragePriceOverTimeLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardAveragePriceOverTimeLineChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardAveragePriceOverTimeLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
