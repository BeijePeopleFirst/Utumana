import { TestBed } from '@angular/core/testing';

import { OccupancyPercentageChartResolver } from './occupancy-percentage-chart.resolver';

describe('OccupancyPercentageChartResolver', () => {
  let resolver: OccupancyPercentageChartResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(OccupancyPercentageChartResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
