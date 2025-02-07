import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, debounceTime, map, Observable, of, Subject, switchMap } from 'rxjs';
import { Accommodation } from '../models/accommodation';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { AccommodationDTO } from '../dtos/accommodationDTO';
import { FormGroup } from '@angular/forms';
import { params } from '../models/searchParams';
import { PriceDTO } from '../dtos/priceDTO';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private accommodationsSubject = new BehaviorSubject<AccommodationDTO[] | null>(null);
  public accommodations$ = this.accommodationsSubject.asObservable();
  private searchParamsSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  public getLatestUploads(): void{
    this.http.get<AccommodationDTO[]>(`${BACKEND_URL_PREFIX}/api/get_latest_uploads`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    ).subscribe(data => {
      console.log(data);
      if(data.length == 0){
        this.accommodationsSubject.next(data);
      }else{
        this.getPrices(data);
      }
    });
}

getPrices(accommodations: AccommodationDTO[]): void {
  let ids = accommodations.map(a => a.id);
  this.http.get<PriceDTO[]>(`${BACKEND_URL_PREFIX}/api/prices?ids=${ids}`).pipe(
    catchError(error => {
      console.error(error);
      return of([]);
    })
  ).subscribe(prices => {
    for(let i: number = 0; i < prices.length; i++){
      accommodations[i].min_price = prices[i].min_price;
      accommodations[i].max_price = prices[i].max_price;
    }
    this.accommodationsSubject.next(accommodations);
  })
}

public searchAccommodations(params: any) {
  this.searchParamsSubject.next(params)
}
public updateAccommodations(accommodationDTO: AccommodationDTO[]) {
  this.accommodationsSubject.next(accommodationDTO);
}
public getSearchResults(): Observable<AccommodationDTO[] | null>{
  return this.searchParamsSubject.pipe(
    debounceTime(300),
    switchMap(params => {
      if (!params) return this.accommodations$;
      console.log('params: ', params);
      const url = `${BACKEND_URL_PREFIX}/api/search`;
      return this.http.get<AccommodationDTO[] | { message: string }>(url, { params })
        .pipe(
          map(response => "message" in response ? null : response),
          catchError(error => {
            console.error(error);
            return of(null);
          })
        );
    })
  //).subscribe(data => this.accommodationsSubject.next(data));
  )
}

getParams(form: any): params {
  console.log(form)
  const params: params = {
    "destination": form.city,
    "check-in": form.check_in,
    "check-out": form.check_out,
    "number_of_guests": form.people,
    "free_only": false,
    "services": [""],
    "order_by": "minPrice-desc"
  }
  return params;
}

  public getAccommodationById(id: number): Observable<(Accommodation | null)> {
    return this.http.get<(Accommodation | {time: string, status: string, message: string})>(BACKEND_URL_PREFIX + "/api/accommodation/" + id)
                      .pipe(
                        map(response => {
                          if("message" in response) return null;
                          else return response;
                        }),

                        catchError(error => {
                          console.log("Errore");
                          console.error(error);
                          return of(null);
                        })
                      )
  }

  deleteAccommodation(id: number): Observable<Accommodation | {message: string, status: string, time: string} | null> {
    //let headers = this.getAuth();

    console.log("SONO IN DELETE");

    return this.http.patch<Accommodation | {message: string, status: string, time: string} | null>(BACKEND_URL_PREFIX + "/api/delete_accommodation/" + id, {})
    .pipe(catchError(err => {console.error(err); return of()}))

  }

  ///remove-favourite/{user_id}/{accommodation_id}
  removeFavourite(userId: number, id: number) {
    //let headers = this.getAuth();

    return this.http.patch<Accommodation | null | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/api/remove-favourite/" + userId + "/" + id, {})
                      .pipe(
                        catchError(
                          error => {
                            console.error(error);
                            return of();
                          }
                        )
                      )

  }

  ///add-favourite/{user_id}/{accommodation_id}
  addFavourite(userId: number, id: number): Observable<Accommodation | null | {message: string, status: string, time: string}> {
    //let headers = this.getAuth();

    return this.http.patch<Accommodation | null | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/api/add-favourite/" + userId + "/" + id, {})
                      .pipe(
                        catchError(
                          error => {
                            console.error(error);
                            return of();
                          }
                        )
                      )
  }

  updateAccommodationAddress(userId: number, accommodation: Accommodation): Observable<Accommodation | null | {message: string, status: string, time: string}> {
    //let headers = this.getAuth();
    accommodation = Object.assign(new Accommodation(), accommodation);

    return this.http.patch<Accommodation | null | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/api/accommodation/" + accommodation.id + "/address",
                        accommodation.toJSON(), {})
                      .pipe(
                        catchError(error => {
                          console.error(error);
                          return of();
                        })
                      )
  }

  updateAccommodationInfo(accommodation: Accommodation): Observable<Accommodation | null | {message: string, status: string, time: string}> {
    //let headers = this.getAuth();
    console.log("input ->", accommodation, accommodation.id);

    accommodation = Object.assign(new Accommodation(), accommodation);

    return this.http.patch<Accommodation | null | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/api/accommodation/" + accommodation.id, accommodation.toJSON(), {})
                      .pipe(
                        catchError(error => {
                          console.error("Errore in Service Accommodation", error);
                          return of();
                        })
                      )
  }

  /*private getAuth(): HttpHeaders {
    let headers = new HttpHeaders();
    return headers;
  }*/
}
