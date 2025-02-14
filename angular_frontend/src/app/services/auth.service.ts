import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay, map, catchError, filter, switchMap } from 'rxjs/operators';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { AuthCredentials } from '../dtos/authCredential';
import { RefreshToken } from '../models/refreshToken';

interface LoginResponse {
  email: string,
  permission: string,
  token: string,
  refresh_token: string,
  id: number
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: boolean = localStorage.getItem("token") != null;

  private refreshInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8', 'Accept-Type': 'application/json; charset=UTF-8' })
  };

  constructor(
    private router: Router,
    private http: HttpClient
  ){
    
   }

  login(user: AuthCredentials): Observable<{ok: boolean, status: number, message: string}> {
    return this.http.post<LoginResponse>(`${BACKEND_URL_PREFIX}/api/signin`, user, this.httpOptions).pipe(
      map(json => {
        console.log(json);
        localStorage.setItem('id',json.id.toString());
			  localStorage.setItem("token", json.token);
			  document.cookie = "refresh_token=" + json.refresh_token;
        return {ok: true, status: 200, message: 'Successfully logged in'};
      }),
      tap(() => this.isLoggedIn = true),
      catchError((err) => {
        console.log(err);
        return of({ok: false, status: Number(err.error.status), message: err.error.message});
      })
    );
  }

  logout(returnUrl?:string): void {
    this.isLoggedIn = false;
    localStorage.clear();
    sessionStorage.clear();
    this.deleteCookies();
    if(returnUrl && returnUrl.indexOf("login") < 0){
      this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl }})
    }else{
      this.router.navigate(['login']);
    }
  }

  private deleteCookies(): void {
    let allCookies = document.cookie.split(';');
    
    // The "expire" attribute of every cookie is 
    // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
    for (let i = 0; i < allCookies.length; i++)
      document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
  }

  public refreshToken(refresh_token:RefreshToken | null): Observable<any>{
    if (this.refreshInProgress) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        switchMap(() => throwError(() => new Error('Token refresh already in progress')))
      );
    }

    return this.http.post<LoginResponse>(`${BACKEND_URL_PREFIX}/api/refresh_token`, refresh_token,this.httpOptions).pipe(
      map(json => {
        localStorage.setItem('id',json.id.toString());
        localStorage.setItem("token", json.token);
        document.cookie = "refresh_token=" + json.refresh_token;
        console.log("Refreshed token. New token:", json.token);

        this.refreshTokenSubject.next(json.token);
        return json;
      }),
      tap(() => {
        this.isLoggedIn = true;
      }),
      catchError((err) => {
        this.logout();
        return of(err);
      })
    );
  }
}
