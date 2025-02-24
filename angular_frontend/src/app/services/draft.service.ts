import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressDTO } from '../dtos/addressDTO';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { catchError, Observable, of, tap } from 'rxjs';
import { Accommodation } from '../models/accommodation';
import { Service } from '../models/service';
import { AccommodationDTO } from '../dtos/accommodationDTO';
import { Availability, AvailabilityInterface } from '../models/availability';

@Injectable({
  providedIn: 'root'
})
export class DraftService {

  constructor(
    private http: HttpClient
  ) { }

  createAccommodationDraft(): Observable<number> {
    const userId = localStorage.getItem("id");
    if(!userId) return of(-1);

    return this.http.post<number>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/new/${userId}`, {}).pipe(
      catchError(error => {
        console.error(error);
        return of(-1);
      }),
      tap(res => {
        console.log("Created new accomnmmodation draft", res);
      })
    );
  }

  getAddress(draftId: number): Observable<AddressDTO | null> {
    return this.http.get<AddressDTO>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/address-info/${draftId}`, {}).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }

  setAddress(address: AddressDTO, draftId: number): void {
    this.http.post<any>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/save-address-info/${draftId}`, address).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    ).subscribe({
      next: () => {
        console.log("Address saved");
      },
      error: error => {
        console.error(error);
      }
    });
  }

  getServices(draftId: number): Observable<Service[] | null> {
    return this.http.get<Service[]>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/services/${draftId}`, {}).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }

  setServices(services: Service[], draftId: number): void {
    this.http.post<any>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/save-services/${draftId}`, services).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    ).subscribe({
      next: () => {
        console.log("Services saved");
      },
      error: error => {
        console.error(error);
      }
    });
  }

  getAvailabilities(draftId: number): Observable<Availability[] | null> {
    return this.http.get<Availability[]>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/availabilities/${draftId}`, {}).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }

  setAvailabilities(availabilities: AvailabilityInterface[] | Availability[], draftId: number): void {
    this.http.post<any>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/save-availabilities/${draftId}`, availabilities).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    ).subscribe({
      next: () => {
        console.log("Availabilities saved");
      },
      error: error => {
        console.error(error);
      }
    });
  }

  getOwnerId(): number {
    const userId = localStorage.getItem("id");
    if(!userId) return -1;
    return Number(userId);
  }

  public getDraftsByOwnerId(ownerId: number): Observable<AccommodationDTO[]> {
    return this.http.get<AccommodationDTO[]>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/owner/${ownerId}`, {}).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }
}
