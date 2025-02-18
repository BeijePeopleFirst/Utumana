import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, debounceTime, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { Accommodation } from '../models/accommodation';
import { BACKEND_URL_PREFIX, LATEST_UPLOADS_LIMIT } from 'src/costants';
import { AccommodationDTO } from '../dtos/accommodationDTO';
import { FormGroup } from '@angular/forms';
import { params } from '../models/searchParams';
import { Availability } from '../models/availability';
import { PriceDTO } from '../dtos/priceDTO';
import { Service } from '../models/service';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private latestAccommodationsSubject = new BehaviorSubject<AccommodationDTO[]>([]);
  public latestAccommodations$ = this.latestAccommodationsSubject.asObservable();
  
  private mostLikedAccommodationsSubject = new BehaviorSubject<AccommodationDTO[]>([]);
  public mostLikedAccommodations$ = this.mostLikedAccommodationsSubject.asObservable();

  private favouritesSubject = new BehaviorSubject<AccommodationDTO[]>([]);
  public favourites$ = this.favouritesSubject.asObservable();

  private foundAccommodationsSubject = new BehaviorSubject<AccommodationDTO[]>([]);
  public foundAccommodations$ = this.foundAccommodationsSubject.asObservable();

  //private searchParamsSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient,private searchService: SearchService ) { }

  public getLatestUploads(): Observable<AccommodationDTO[]> {
    return this.getAccommodationsDTO(`${BACKEND_URL_PREFIX}/api/accommodation/latest_uploads`);
  }

  getMostLikedAccommodations(): Observable<AccommodationDTO[]> {
    return this.getAccommodationsDTO(`${BACKEND_URL_PREFIX}/api/accommodation/most_liked`);
  }

  getFavourites(): Observable<AccommodationDTO[]> {
    const userId = localStorage.getItem("id");
    if(!userId){
      return of([]);
    }
    return this.getAccommodationsDTO(`${BACKEND_URL_PREFIX}/api/favorites/${userId}`); // backend is not paginated
  }

  getMyAccommodations(): Observable<AccommodationDTO[]> {
    const userId = localStorage.getItem("id");
    if(!userId){
      return of([]);
    }
    return this.getAccommodationsDTO(`${BACKEND_URL_PREFIX}/api/my_accommodations/${userId}`); // backend is not paginated
  }

  getMyPendingAccommodations(): Observable<AccommodationDTO[]> {
    const userId = localStorage.getItem("id");
    if(!userId){
      return of([]);
    }
    return this.getAccommodationsDTO(`${BACKEND_URL_PREFIX}/api/pending_accommodations/${userId}`); // backend is not paginated
  }

  getMyRejectedAccommodations(): Observable<AccommodationDTO[]> {
    const userId = localStorage.getItem("id");
    if(!userId){
      return of([]);
    }
    return this.getAccommodationsDTO(`${BACKEND_URL_PREFIX}/api/rejected_accommodations/${userId}`); // backend is not paginated
  }

  /** @Param url - url of api request (should already include pagination params, if any) */
  getAccommodationsDTO(url: string): Observable<AccommodationDTO[]> {
    return this.http.get<AccommodationDTO[]>(url).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      }),
      tap(data => {
        console.log("Accommodation Service - Fetched accommodations DTO:", data);
      })
    );
  }

  getPrices(accommodations: AccommodationDTO[]): Observable<AccommodationDTO[]> {
    let ids = accommodations.map(a => a.id);
    return this.http.get<PriceDTO[]>(`${BACKEND_URL_PREFIX}/api/accommodation/prices?ids=${ids}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      }),
      map(prices => {
        for(let i: number = 0; i < prices.length; i++){
          accommodations[i].min_price = prices[i].min_price;
          accommodations[i].max_price = prices[i].max_price;
        }
        return accommodations;
      })
    );
  }

  getAccommodationsDTOToSubject(url: string, offset: number, pageSize: number, subject: Subject<AccommodationDTO[]>): void {
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
        this.getPricesToSubject(data.slice(offset, offset + pageSize), subject); // remove slice when result will be paginated by backend
      }
    });
  }

  getPricesToSubject(accommodations: AccommodationDTO[], subject: Subject<AccommodationDTO[]>): void {
    let ids = accommodations.map(a => a.id);
    this.http.get<PriceDTO[]>(`${BACKEND_URL_PREFIX}/api/accommodation/prices?ids=${ids}`).pipe(
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

  public getSearchResults(offset: number, pageSize: number): void{
    const currentParams = this.searchService.getSearchData();
    console.log("current params: ",currentParams)
    if (!currentParams) return;
      let httpParams = new HttpParams();
      Object.keys(currentParams).forEach(key => {
        if ((currentParams as any)[key] != null) {
          httpParams = httpParams.set(key, (currentParams as any)[key]);
        }
      })
      const url = `${BACKEND_URL_PREFIX}/api/search?${httpParams.toString()}`;
      this.getAccommodationsDTOToSubject(url, offset, pageSize, this.foundAccommodationsSubject);
    }

  getParams(form: any): params {
    console.log(form)
    const params: params = {
      "destination": form.city,
      "check-in": form.check_in,
      "check-out": form.check_out,
      "number_of_guests": form.people,
      "free_only": form.free_only,
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

  setAccommodationServices(acc: Accommodation, selectedServices: Service[]): Observable<Accommodation | {message: string, status: string, time: string}> {

    let list: number[] = selectedServices.map(s => s.id);

    return this.http.patch<Accommodation | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/api/accommodation/" + acc.id + "/services",
      list
    ).pipe(
      catchError(error => {
        console.log("Error inside setAccommodationServices accommodation service");
        return of();
      })
    );
  }

  /*private getAuth(): HttpHeaders {
    let headers = new HttpHeaders();
    return headers;
  }*/
}
