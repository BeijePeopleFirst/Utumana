import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Accommodation } from '../models/accommodation';
import { BACKEND_URL_PREFIX } from 'src/costants';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {

  constructor(private http: HttpClient) { }


  public getAccommodationById(id: number): Observable<(Accommodation | null)> {
    let token: (string | null) = localStorage.getItem("token");
    let headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    return this.http.get<(Accommodation | {time: string, status: string, message: string})>(BACKEND_URL_PREFIX + "/accommodation/" + id, {headers})
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

  deleteAccommodation(id: number): Observable<Accommodation | {message: string, status: string, time: string} | null> {
    let token: (string | null) = localStorage.getItem("token");
    let headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    return this.http.patch<Accommodation | {message: string, status: string, time: string} | null>(BACKEND_URL_PREFIX + "/delete_accommodation/" + id, {headers})
    .pipe(catchError(err => {console.error(err); return of()}))

  }
}
