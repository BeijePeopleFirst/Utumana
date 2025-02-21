import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CompleteParams } from '../models/completeParams';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  
  private searchDataSubject = new BehaviorSubject<CompleteParams>({});

  public searchData$ = this.searchDataSubject.asObservable();

  setSearchData(data: CompleteParams): void {
    this.searchDataSubject.next(data);
  }

  getSearchData(): CompleteParams {
    return this.searchDataSubject.value;
  }
}
