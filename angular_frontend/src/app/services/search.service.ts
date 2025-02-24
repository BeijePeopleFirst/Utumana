import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { CompleteParams } from '../models/completeParams';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL_PREFIX } from 'src/costants';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient){}
  
  private searchDataSubject = new BehaviorSubject<CompleteParams>({});

  public searchData$ = this.searchDataSubject.asObservable();

  setSearchData(data: CompleteParams): void {
    this.searchDataSubject.next(data);
  }

  getSearchData(): CompleteParams {
    return this.searchDataSubject.value;
  }

  getAllCities(): Observable<string[]> {
    return this.httpClient.get<string[]>(BACKEND_URL_PREFIX + '/api/cities').pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    )
  }
}
