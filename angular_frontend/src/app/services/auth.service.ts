import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay, map, catchError, filter, switchMap } from 'rxjs/operators';
import { BACKEND_URL_PREFIX, defaultProfilePictureUrl } from 'src/costants';
import { AuthCredentials } from '../dtos/authCredential';
import { RefreshToken } from '../models/refreshToken';
import { LoginResponse } from '../utils/loginResponse';
import { DraftService } from './draft.service';
import { S3Service } from './s3.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: boolean = localStorage.getItem("token") != null;
  isUserAdmin$ = new BehaviorSubject<boolean | null>(null);
  profilePictureUrl$ = new BehaviorSubject<string>('');

  private refreshInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8', 'Accept-Type': 'application/json; charset=UTF-8' })
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private draftService: DraftService,
    private s3Service: S3Service
  ){ }

  login(user: AuthCredentials): Observable<{ok: boolean, status: number, message: string}> {
    return this.http.post<LoginResponse>(`${BACKEND_URL_PREFIX}/api/signin`, user, this.httpOptions).pipe(
      map(json => {
        console.log(json);
        // save user information
        localStorage.setItem('id',json.id.toString());
        localStorage.setItem("email", json.email);
			  localStorage.setItem("token", json.token);
			  document.cookie = "refresh_token=" + json.refresh_token;

        // notify subscribers if user is admin
        if(json.permission.includes("ADMIN")){
          this.isUserAdmin$.next(true);
        }else{
          this.isUserAdmin$.next(false);
        }

        // notify subscribers if user has open drafts
        this.draftService.loggedUserHasOpenDrafts().subscribe(hasOpen => {
          localStorage.setItem("hasOpenDrafts", hasOpen.toString());
          this.draftService.hasOpenDrafts$.next(hasOpen);
        });

        // get profile picture blob and notify subscribers
        this.s3Service.getPhoto(json.profile_picture_url).subscribe(blob => {
          if(blob != null){  
            localStorage.setItem("profilePictureUrl", json.profile_picture_url);
            this.profilePictureUrl$.next(json.profile_picture_url);
          }
        });
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
    this.isUserAdmin$.next(false);
    localStorage.clear();
    sessionStorage.clear();
    this.deleteCookies();
    this.profilePictureUrl$.next(defaultProfilePictureUrl);
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

  public isAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${BACKEND_URL_PREFIX}/api/is_admin`)
  }
}
