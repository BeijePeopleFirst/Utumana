import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { AccommodationDTO } from '../dtos/accommodationDTO';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { AdminSearchParams } from '../models/adminSearchParams';
import { S3Service } from './s3.service';
import { PageResponse } from '../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardSearchService {

  constructor(private httpClient: HttpClient, private s3Service: S3Service) { }

  foundAccommodationSubject = new BehaviorSubject<AccommodationDTO[] | null>(null);
  foundAccommodation$ = this.foundAccommodationSubject.asObservable();
  errorMessageSubject = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessageSubject.asObservable();

  search(params: AdminSearchParams): Observable<PageResponse<AccommodationDTO>> {
    const queryParams = Object.entries(params)
    .reduce((httpParams, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        return httpParams.set(key, value);
      }
      return httpParams;
    }, new HttpParams());

    return this.httpClient.get<PageResponse<AccommodationDTO>>(BACKEND_URL_PREFIX + `/api/admin/search`, { params: queryParams }).pipe(
      map(data => {
        console.log("Admin Dashboard Search Service - Found accommodations:", data);
        for(let acc of data.content){
          console.log("Admin Dashboard Search Service - Found accommodation:", acc);
          this.s3Service.getPhoto(acc.main_photo_url).subscribe(blob => {
            if(blob != null){
              acc.main_photo_blob_url = URL.createObjectURL(blob);
            }
          })
        }
        console.log("Accommodation Service - Fetched accommodations DTO:", data);
        return data;
      }),
      catchError(error => {
        console.error("Error fetching active accommodations:", error);
        return of({
          content: [],
          pageable: {
            pageNumber: 0,
            pageSize: params.size ?? 10,
            sort: { empty: true, sorted: false, unsorted: true },
            offset: 0,
            paged: true,
            unpaged: false
          },
          totalPages: 0,
          totalElements: 0,
          last: true,
          size: params.size ?? 10,
          number: 0,
          sort: { empty: true, sorted: false, unsorted: true },
          first: true,
          numberOfElements: 0,
          empty: true
        });
      })
    );
  }
}
