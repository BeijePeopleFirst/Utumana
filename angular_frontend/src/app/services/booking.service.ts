import { Injectable } from '@angular/core';
import { Booking } from '../models/booking';
import { HttpClient } from '@angular/common/http';
import { BookingDTO } from '../dtos/bookingDTO';
import { BehaviorSubject, catchError, Observable, of, Subject } from 'rxjs';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { Availability } from '../models/availability';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  newBooking(createdBooking: Booking): Observable<{message: string, status: string, time: string} | BookingDTO> {
    console.log("Stampo il booking -> ", createdBooking);
    return this.http.post<{message: string, status: string, time: string} | BookingDTO>(BACKEND_URL_PREFIX + "/api/book/" + createdBooking.accommodation.id + "?checkIn=" + createdBooking.check_in + "&checkOut=" + createdBooking.check_out, 
                        {
                          checkIn: createdBooking.check_in,
                          checkOut: createdBooking.check_out
                        }
    ).pipe(
      catchError(error => {console.log("ERRORE"); return of(error.error)})
    );
  }

  newUnavailability(createdBooking: Availability): Observable<{message: string, status: string, time: string} | Availability> {
    console.log("PROVA", createdBooking);
    return this.http.post<{message: string, status: string, time: string} | Availability>(BACKEND_URL_PREFIX + "/api/add_unavailability", 
      {
        start_date: createdBooking.start_date,
        end_date: createdBooking.end_date,
        accommodation_id: createdBooking.accommodation_id
      }
    )
    .pipe(
      catchError(error => {console.log("ERRORE"); return of(error.error)})
    );
  }
  
  public getBookings(url: string): Observable<BookingDTO[]>{
    // TODO get page of results from backend
    return this.http.get<BookingDTO[]>(url).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  public getDoneBookings():Observable<BookingDTO[]>{
    return this.getBookings(`${BACKEND_URL_PREFIX}/api/myBookingGuest?status=DONE`);
  }

  public getPendingBookings():Observable<BookingDTO[]>{
    return this.getBookings(`${BACKEND_URL_PREFIX}/api/myBookingGuest?status=PENDING`);
  }

  public getRejectedBookings():Observable<BookingDTO[]>{
    return this.getBookings(`${BACKEND_URL_PREFIX}/api/myBookingGuest?status=REJECTED`);
  }

  public getAcceptedBookings():Observable<BookingDTO[]>{
    return this.getBookings(`${BACKEND_URL_PREFIX}/api/myBookingGuest?status=ACCEPTED`);
  }

  public getDoingBookings():Observable<BookingDTO[]>{
    return this.getBookings(`${BACKEND_URL_PREFIX}/api/myBookingGuest?status=DOING`);
  }
}
