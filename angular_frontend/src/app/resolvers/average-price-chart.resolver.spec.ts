import { TestBed } from '@angular/core/testing';

import { AveragePriceChartResolver } from './average-price-chart.resolver';

describe('AveragePriceChartResolver', () => {
  let resolver: AveragePriceChartResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AveragePriceChartResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
