import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<User | null | {message: string, status: string, time: string}> {
    let token: (string | null) = localStorage.getItem("token");
    let headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    return this.http.get<User | null | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/api/user/" + id, {headers}).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    )
  }
}
