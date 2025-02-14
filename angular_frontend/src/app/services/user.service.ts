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

  getUserById(id: number): Observable<User | {message: string, status: string, time: string}> {
    return this.http.get<User>(BACKEND_URL_PREFIX + "/api/user/" + id, {}).pipe(
      catchError(error => {
        console.error(error);
        return of(error.error);
      })
    )
  }
}
