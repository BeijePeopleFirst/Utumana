import { TestBed } from '@angular/core/testing';

import { AdminDashboardChartsService } from './admin-dashboard-charts.service';

describe('AdminDashboardChartsService', () => {
  let service: AdminDashboardChartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDashboardChartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
