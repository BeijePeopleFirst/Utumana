import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RefreshToken } from '../models/refreshToken';
import { getCookie } from '../utils/utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(!req.url.includes('signin') && !req.url.includes('forgotPassword') && !req.url.includes('refresh_token')){
      const authToken =  localStorage.getItem("token");
      let authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          ContentType: 'application/json'
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
    }else{
      let authReq=req.clone();
      return next.handle(authReq);
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

    if (!this.isRefreshing) {

      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      let refresh = new RefreshToken(0,0,getCookie('refresh_token'),"")

      console.log(refresh);

      return this.authService.refreshToken(refresh).pipe(
        switchMap((tokenData: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(tokenData.refresh_token);
          return this.intercept(request,next);
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => this.intercept(request,next))
      );
    }
  }
}