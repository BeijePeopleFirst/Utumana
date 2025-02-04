import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Accommodation } from '../models/accommodation';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {

  constructor(private http: HttpClient) { }


  public getAccommodationById(id: number): Observable<(Accommodation | {time: string, status: string, message: string})> {

  }
}
