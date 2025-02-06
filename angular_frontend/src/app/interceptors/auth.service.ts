import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let authReq=req.clone();

    if(!req.url.includes('signin') && !req.url.includes('forgotPassword')){
      const authToken =  localStorage.getItem("token");
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          ContentType: 'application/json'
        }
      });
    }

    console.log('Intercepted HTTP request:', authReq);
    
    return next.handle(authReq);
  }
}