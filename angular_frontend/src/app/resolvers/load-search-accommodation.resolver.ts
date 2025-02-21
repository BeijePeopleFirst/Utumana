import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AccommodationService } from '../services/accommodation.service';
import { SearchService } from '../services/search.service';
import { FiltersService } from '../services/filters.service';
import { CompleteParams } from '../models/completeParams';
import { FilterParams } from '../models/filterParams';
import { PageResponse } from '../models/paginatedResponse';
import { AccommodationDTO } from '../dtos/accommodationDTO';

@Injectable({
  providedIn: 'root',
})
export class LoadSearchAccommodationResolver implements Resolve<any> {
  constructor(
    private accommodationService: AccommodationService,
    private searchService: SearchService,
    private filterService: FiltersService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PageResponse<AccommodationDTO>>{
    const queryParams = route.queryParams;

    const services = queryParams['services']
      ? (Array.isArray(queryParams['services'])
          ? [...queryParams['services']]
          : [queryParams['services']])
      : [];

    const searchParams: CompleteParams = {
      destination: queryParams['destination'],
      ['check-in']: queryParams['check-in'] ?? '',
      ['check-out']: queryParams['check-out'] ?? '',
      number_of_guests: queryParams['number_of_guests'],
      free_only: queryParams['free_only'],
      services: services,
      order_by: queryParams['order_by'],
      order_direction: queryParams['order_direction'],
      min_price: queryParams['min_price'],
      max_price: queryParams['max_price'],
      min_rating: queryParams['min_rating'],
      max_rating: queryParams['max_rating'],
      page: queryParams['page'] ? parseInt(queryParams['page']) : 0,
      size: queryParams['size'] ?? 8,
    }
    
    this.searchService.setSearchData(searchParams);
    this.filterService.getAllServices();
    const filterParams: FilterParams = {
      services: services,
      min_price: searchParams.min_price,
      max_price: searchParams.max_price,
      min_rating: searchParams.min_rating,
      max_rating: searchParams.max_rating,
    };
    this.filterService.setSelectedFilters(filterParams);
    console.log("page", searchParams.page, "size", searchParams.size)

    return this.accommodationService.getSearchResults(searchParams.page ?? 0, searchParams.size ?? 8);
  }
}
