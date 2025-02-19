import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service } from '../models/service';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { SearchService } from './search.service';
import { AccommodationService } from './accommodation.service';
import { FilterParams } from '../models/filterParams';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private servicesSubject = new BehaviorSubject<Service[]>([]);
  private selectedFiltersSubject = new BehaviorSubject<FilterParams>({
/*     services: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
    maxRating: null */
  });
  
  services$ = this.servicesSubject.asObservable();
  selectedFilters$ = this.selectedFiltersSubject.asObservable();

  private filters: FilterParams = {
/*     destination: '',
    number_of_guests: 0,
    free_only: false,
    services: [],
    order_by: '',
    minPrice: null,
    maxPrice: null,
    minRating: null,
    maxRating: null */
  }
  
  constructor(
    private httpClient: HttpClient, 
    private searchService: SearchService, 
    private accommodationService: AccommodationService
  ) { }

  getAllServices(): void {
    this.httpClient.get<Service[]>(BACKEND_URL_PREFIX + '/api/services').pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    ).subscribe(data => {
      console.log(data);
      this.servicesSubject.next(data);
    });
  }

  setSelectedFilters(filters: FilterParams): void {
/*     // Merge i nuovi filtri con quelli esistenti
    const currentFilters = this.selectedFiltersSubject.getValue();
    const updatedFilters = { ...currentFilters, ...filters };
    
    // Rimuovi i valori null o undefined
    (Object.keys(updatedFilters) as Array<keyof FilterParams>).forEach(key => {
      if (updatedFilters[key] === null || updatedFilters[key] === undefined) {
        delete updatedFilters[key];
      }
    });
     */
    this.selectedFiltersSubject.next(filters);
  }
  
  getSelectedFilters(): string[] {
    return this.selectedFiltersSubject.getValue().services || [];
  }

  getAllFilters(): FilterParams {
    return this.selectedFiltersSubject.getValue();
  }

  saveAllFilters(filters: FilterParams): void {
    this.setSelectedFilters(filters);
  }

  clearFilters(): void {
    this.selectedFiltersSubject.next({
      services: [],
      min_price: undefined,
      max_price: undefined,
      min_rating: undefined,
      max_rating: undefined
    });
  }
}