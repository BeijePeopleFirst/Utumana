import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressDTO } from '../dtos/addressDTO';
import { BACKEND_URL_PREFIX, s3Prefix } from 'src/costants';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Accommodation } from '../models/accommodation';
import { Service } from '../models/service';
import { AccommodationDTO } from '../dtos/accommodationDTO';
import { Availability, AvailabilityInterface } from '../models/availability';
import { UnavailabilityDTO, UnavailabilityInterface } from '../dtos/unavailabilityDTO';
import { GeneralAccommodationInfoDTO } from '../dtos/generalAccommodationInfoDTO';
import { Photo } from '../models/photo';
import { Coordinates } from '../models/coordinates';
import { S3Service } from './s3.service';

@Injectable({
  providedIn: 'root'
})
export class DraftService {

  constructor(
    private http: HttpClient,
    private s3Service: S3Service
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

  getUnavailabilities(draftId: number): Observable<UnavailabilityInterface[] | null> {
    return this.http.get<UnavailabilityInterface[]>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/unavailabilities/${draftId}`, {}).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }

  setUnavailabilities(unavailabilities: UnavailabilityInterface[] | UnavailabilityDTO[], draftId: number): void {
    this.http.post<any>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/save-unavailabilities/${draftId}`, unavailabilities).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    ).subscribe({
      next: () => {
        console.log("Unavailabilities saved");
      },
      error: error => {
        console.error(error);
      }
    });
  }

  getAccommodationInfo(draftId: number): Observable<GeneralAccommodationInfoDTO | null> {
    return this.http.get<GeneralAccommodationInfoDTO>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/accommodation-info/${draftId}`, {}).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }

  setAccommodationInfo(info: GeneralAccommodationInfoDTO, draftId: number): void {
    this.http.post<any>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/save-accommodation-info/${draftId}`, info).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    ).subscribe({
      next: () => {
        console.log("Accommodation info saved");
      },
      error: error => {
        console.error(error);
      }
    });
  }

  getPhotos(draftId: number): Observable<Photo[] | null> {
    const authToken =  localStorage.getItem("token");
    return this.http.get<Photo[]>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/photos/${draftId}`, { 
      headers: { 
        Authorization: `Bearer ${authToken}`, 
        ContentType: 'application/json',
        AcceptType: 'application/json' } 
      }).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }

  uploadPhoto(draftId: number, photo: File, order: number): Observable<Photo | null> {
    const authToken =  localStorage.getItem("token");
    const formData: FormData = new FormData();
    formData.append('photo', photo);
    formData.append('order', order.toString());

    return this.http.post<Photo>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/add-photo/${draftId}`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ContentType: 'multipart/form-data',
        AcceptType: 'application/json'
      }
    }).pipe(
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }

  removePhoto(draftId: number, photoId: number): void {
    if(!draftId || draftId < 0 || !photoId || photoId < 0) 
      return;
    
    const authToken =  localStorage.getItem("token");
    this.http.delete<any>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/${draftId}/remove-photo/${photoId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ContentType: 'application/json',
        AcceptType: 'application/json'
      }
    }).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    ).subscribe({
      next: () => {
        console.log("Photo removed");
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
      }),
      map(data => {
        for(let acc of data){
          this.s3Service.getPhoto(acc.main_photo_url).subscribe(blob => {
            if(blob != null){
              acc.main_photo_blob_url = URL.createObjectURL(blob);
            }
          })
        }
        console.log("Draft Service - Fetched accommodation drafts DTO:", data);
        return data;
      })
    );
  }

  publishDraft(draftId: number): Observable<number> {
    return this.http.post<Accommodation>(`${BACKEND_URL_PREFIX}/api/accommodation-draft/publish/${draftId}`, {}).pipe(
      map(accommodation => accommodation.id ?? -1),
      catchError(error => {
        console.error(error);
        return of(-1);
      })
    );
  }

  async getCoordinates(address: string): Promise<Coordinates | null> {  
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  }
}
