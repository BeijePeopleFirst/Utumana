import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Accommodation } from '../models/accommodation';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { AccommodationDTO } from '../dtos/accommodationDTO';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  

  constructor(private http: HttpClient) { }

  public getLatestUploads(): Observable<(AccommodationDTO[] | null)>{
    return this.http.get<(AccommodationDTO[] | {time: string, status: string, message: string})>(BACKEND_URL_PREFIX + "/api/get_latest_uploads")
    .pipe(
      map(response => {
        if("message" in response) return null;
        else return response;
      }),

      catchError(error => {
        console.error(error);
        return of(null);
      })
    )
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
    let headers = this.getAuth();

    return this.http.patch<Accommodation | {message: string, status: string, time: string} | null>(BACKEND_URL_PREFIX + "/delete_accommodation/" + id, {headers})
    .pipe(catchError(err => {console.error(err); return of()}))

  }

  ///remove-favourite/{user_id}/{accommodation_id}
  removeFavourite(userId: number, id: number) {
    let headers = this.getAuth();

    return this.http.patch<Accommodation | null | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/remove-favourite/" + userId + "/" + id, {headers})
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
    let headers = this.getAuth();

    return this.http.patch<Accommodation | null | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/add-favourite/" + userId + "/" + id, {headers})
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
    let headers = this.getAuth();

    return this.http.patch<Accommodation | null | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/accommodation/" + accommodation.id + "/address",
                        {newOne: accommodation}, {headers})
                      .pipe(
                        catchError(error => {
                          console.error(error);
                          return of();
                        })
                      )
  }

  updateAccommodationInfo(accommodation: Accommodation): Observable<Accommodation | null | {message: string, status: string, time: string}> {
    let headers = this.getAuth();
    console.log(accommodation);

    return this.http.patch<Accommodation | null | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/api/accommodation/" + accommodation.id, {newOne: JSON.stringify(accommodation)}, {headers})
                      .pipe(
                        catchError(error => {
                          console.error("Errore in Service Accommodation", error);
                          return of();
                        })
                      )
  }

  private getAuth(): HttpHeaders {
    let headers = new HttpHeaders();
    return headers;
  }
}
