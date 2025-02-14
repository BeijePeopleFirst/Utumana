import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Service } from '../models/service';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL_PREFIX } from 'src/costants';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  

  constructor(private http: HttpClient) { }

  searchServices(term: string): Observable<Service[] | {message: string, status: string, time: string}> {
    return this.http.get<Service[] | {message: string, status: string, time: string}>(BACKEND_URL_PREFIX + "/api/services/search?title=" + term);
  }
}
