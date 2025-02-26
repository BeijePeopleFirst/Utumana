import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RefreshToken } from '../models/refreshToken';
import { getCookie } from '../utils/utils';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.includes('refresh_token')){
      // forward request without overwriting headers
      // logout in case of 401 error 
      console.log("Asking for refresh of token");
      return next.handle(req).pipe(
        catchError(error => {
          if ( error.status === 401) {
            this.authService.logout( this.router.routerState.snapshot.url );
          }
          return  of(new HttpResponse({status: 400, statusText: "Error trying to refresh token: invalid refresh_token"}));
          //return throwError(() => error);
        })
      );
    }else if(req.url.includes('photo')){
      // forward request without overwriting headers
      // handle 401 error with method handle401Error
      return next.handle(req).pipe(
        catchError(error => {
          if ( error.status === 401) {
            return this.handle401Error(req, next);
          }
          return throwError(() => error);
        })
      ); 

    }else if(req.url.includes('signin') || req.url.includes('forgotPassword') || req.url.includes('refresh_token')){
      // forward request without overwriting headers
      return next.handle(req);
    }else{
      // set request headers
      // handle 401 error with method handle401Error
      const authToken =  localStorage.getItem("token");
      let authReq: HttpRequest<any>;
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          ContentType: 'application/json',
          AcceptType: 'application/json'
        }
      });

      return next.handle(authReq).pipe(
        catchError(error => {
          if ( error.status === 401) {
            return this.handle401Error(authReq, next);
          }
          return throwError(() => error);
        })
      ); 
    }
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("401 error request", request);
    if(request.headers.get('IsRetry') === 'true'){
      return throwError(() => new Error("Request failed a second time"));
    }
    let retryRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ContentType: request.headers.get('ContentType') || 'application/json',
        AcceptType: request.headers.get('AcceptType') || 'application/json',
        IsRetry: 'true'
      }
    });


    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      let refresh = new RefreshToken(0,0,getCookie('refresh_token'),"");
      console.log(refresh);

      if(!refresh.refresh_token){
        this.isRefreshing = false;
        this.authService.logout( this.router.routerState.snapshot.url );
        console.log("In if !refresh token");
        return of(new HttpResponse({status: 400, statusText: "Invalid refresh token"}));
      }
        

      return this.authService.refreshToken(refresh).pipe(
        switchMap((tokenData: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(tokenData.token);
          return this.intercept(retryRequest,next);
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.authService.logout();
          console.log("In catch error");
          return  of(new HttpResponse({status: 400, statusText: "Error trying to refresh token"}));
          //return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => this.intercept(retryRequest,next))
      );
    }
  }
}