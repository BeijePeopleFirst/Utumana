import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { params } from '../models/searchParams';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  
  private searchDataSubject = new BehaviorSubject<params>({});

  public searchData$ = this.searchDataSubject.asObservable();

  setSearchData(data: params) {
    this.searchDataSubject.next(data);
  }

  getSearchData(): params {
    return this.searchDataSubject.value;
  }
}
