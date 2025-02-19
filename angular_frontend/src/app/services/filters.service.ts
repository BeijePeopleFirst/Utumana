import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service } from '../models/service';
import { BACKEND_URL_PREFIX, prefixUrl } from 'src/costants';
import { BehaviorSubject, catchError, Observable, of, Subject } from 'rxjs';
import { SearchService } from './search.service';
import { params } from '../models/searchParams';
import { AccommodationService } from './accommodation.service';
import { AccommodationDTO } from '../dtos/accommodationDTO';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private servicesSubject = new BehaviorSubject<Service[]>([]);
  private selectedFiltersSubject = new BehaviorSubject<string[]>([]);
  
  services$ = this.servicesSubject.asObservable();
  selectedFilters$ = this.selectedFiltersSubject.asObservable();

  private filters: params = {
    destination: '',
    number_of_guests: 0,
    free_only: false,
    services: [],
    order_by: ''
  }
  
  constructor(private httpClient: HttpClient, private searchService: SearchService, private accommodationService: AccommodationService) { }

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

  setSelectedFilters(selectedServices: string[]): void {
    this.selectedFiltersSubject.next(selectedServices);
  }
  
  getSelectedFilters(): string[] {
    return this.selectedFiltersSubject.getValue();
  }
}

