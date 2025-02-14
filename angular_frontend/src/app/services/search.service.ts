import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { params } from '../models/searchParams';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  
  private searchDataSubject = new BehaviorSubject<params>({
    destination: '',
    'check-in': undefined,
    'check-out': undefined,
    number_of_guests: 0,
    free_only: false,
    services: [''],
    order_by: ''
  });

  public searchData$ = this.searchDataSubject.asObservable();

  setSearchData(data: params) {
    this.searchDataSubject.next(data);
  }

  getSearchData(): params {
    return this.searchDataSubject.value;
  }
}
