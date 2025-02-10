import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, debounceTime, map, Observable, of, Subject, switchMap } from 'rxjs';
import { Accommodation } from '../models/accommodation';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { AccommodationDTO } from '../dtos/accommodationDTO';
import { FormGroup } from '@angular/forms';
import { params } from '../models/searchParams';
import { Availability } from '../models/availability';
import { PriceDTO } from '../dtos/priceDTO';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  
  private latestAccommodationsSubject = new BehaviorSubject<AccommodationDTO[]>([]);
  public latestAccommodations$ = this.latestAccommodationsSubject.asObservable();
  private mostLikedAccommodationsSubject = new BehaviorSubject<AccommodationDTO[]>([]);
  public mostLikedAccommodations$ = this.mostLikedAccommodationsSubject.asObservable();

  private searchParamsSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  public getLatestUploads(offset: number, pageSize: number): void {
    this.getAccommodationsDTO(`${BACKEND_URL_PREFIX}/api/get_latest_uploads`, offset, pageSize, this.latestAccommodationsSubject);
  }

  getMostLikedAccommodations(offset: number, pageSize: number): void {
    // TODO get most liked accommodations from backend
    this.getAccommodationsDTO(`${BACKEND_URL_PREFIX}/api/get_latest_uploads`, offset, pageSize, this.mostLikedAccommodationsSubject);
  }

  getAccommodationsDTO(url: string, offset: number, pageSize: number, subject: Subject<AccommodationDTO[]>): void {
    // TODO get page of results
    this.http.get<AccommodationDTO[]>(url).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    ).subscribe(data => {
      console.log("Accommodation Service - Fetched accommodations DTO:", data);
      if(data.length == 0){
        subject.next(data);
      }else{
        this.getPrices(data.slice(offset, offset + pageSize), subject); // remove slice when result will be paginated by backend
      }
    });
  }

  getPrices(accommodations: AccommodationDTO[], subject: Subject<AccommodationDTO[]>): void {
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
      subject.next(accommodations);
    })
  }

  public searchAccommodations(params: any) {
    this.searchParamsSubject.next(params)
  }

  public getSearchResults(): Observable<AccommodationDTO[] | null>{
    return this.searchParamsSubject.pipe(
      debounceTime(300),
      switchMap(params => {
        if (!params) return this.latestAccommodations$;
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

  addFavouriteToCurrentUser(accommodationId: number): Observable<Boolean> {
    const userId = localStorage.getItem("id");
    if(!userId){
      return of(false);
    }
    return this.http.patch<Accommodation>(`${BACKEND_URL_PREFIX}/api/add-favourite/${userId}/${accommodationId}`, {}).pipe(
      map(_ =>  true),
      catchError(err => {
        console.log(err.error);
        return of(false);
      })
    );
  }

  removeFavouriteFromCurrentUser(accommodationId: number): Observable<Boolean> {
    const userId = localStorage.getItem("id");
    if(!userId){
      return of(false);
    }
    return this.http.patch<Accommodation>(`${BACKEND_URL_PREFIX}/api/remove-favourite/${userId}/${accommodationId}`, {}).pipe(
      map(_ =>  true),
      catchError(err => {
        console.log(err.error);
        return of(false);
      })
    );
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

  getAvailabilities(accommodation: Accommodation): Observable<Availability[] | {message: string, status: string, time: string}> {
    return this.http.get<Availability[] | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/api/accommodation/" + accommodation.id + "/availabilities");
  }

  fetchDate(day: number, monthName: string, year: number): number {
    switch (monthName) {
      case "January": return Date.parse("" + year + "/01/" + (day < 10 ? "0" + day : day));
      case "February": return Date.parse("" + year + "/02/" + (day < 10 ? "0" + day : day));
      case "March": return Date.parse("" + year + "/03/" + (day < 10 ? "0" + day : day));
      case "April": return Date.parse("" + year + "/04/" + (day < 10 ? "0" + day : day));
      case "May": return Date.parse("" + year + "/05/" + (day < 10 ? "0" + day : day));
      case "June": return Date.parse("" + year + "/06/" + (day < 10 ? "0" + day : day));
      case "July": return Date.parse("" + year + "/07/" + (day < 10 ? "0" + day : day));
      case "August": return Date.parse("" + year + "/08/" + (day < 10 ? "0" + day : day));
      case "September": return Date.parse("" + year + "/09/" + (day < 10 ? "0" + day : day));
      case "October": return Date.parse("" + year + "/10/" + (day < 10 ? "0" + day : day));
      case "November": return Date.parse("" + year + "/11/" + (day < 10 ? "0" + day : day));
      case "December": return Date.parse("" + year + "/12/" + (day < 10 ? "0" + day : day));
      default: return -1;
    }
  }

  /*private getAuth(): HttpHeaders {
    let headers = new HttpHeaders();
    return headers;
  }*/
}
