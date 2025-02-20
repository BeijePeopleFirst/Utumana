import { TestBed } from '@angular/core/testing';

import { LoadSearchAccommodationResolver } from './load-search-accommodation.resolver';

describe('LoadSearchAccommodationResolver', () => {
  let resolver: LoadSearchAccommodationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LoadSearchAccommodationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
