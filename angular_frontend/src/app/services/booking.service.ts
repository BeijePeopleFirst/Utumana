import { Injectable } from '@angular/core';
import { Booking } from '../models/booking';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { BookingDTO } from '../dtos/bookingDTO';
import { BACKEND_URL_PREFIX } from 'src/costants';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  

  constructor(private http: HttpClient) { }

  newBooking(createdBooking: Booking): Observable<{message: string, status: string, time: string} | BookingDTO> {
    return this.http.post<{message: string, status: string, time: string} | BookingDTO>(BACKEND_URL_PREFIX + "/api/book/" + createdBooking.accommodation.id + "?checkIn=" + createdBooking.check_in + "&checkOut=" + createdBooking.check_out, 
                        {
                          checkIn: createdBooking.check_in,
                          checkOut: createdBooking.check_out
                        }
    ).pipe(
      catchError(error => {console.log("ERRORE"); return of(error.error)})
    );
  }
}
