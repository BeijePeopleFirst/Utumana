import { TestBed } from '@angular/core/testing';

import { AdminDashboardSearchService } from './admin-dashboard-search.service';

describe('AdminDashboardSearchService', () => {
  let service: AdminDashboardSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDashboardSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
