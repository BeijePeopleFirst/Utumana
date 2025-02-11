import { Injectable } from '@angular/core';
import { Booking } from '../models/booking';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, BehaviorSubject } from 'rxjs';
import { BookingDTO } from '../dtos/bookingDTO';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { Availability } from '../models/availability';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookingsSubject = new BehaviorSubject<BookingDTO[] | null>(null);
  public bookings$ = this.bookingsSubject.asObservable();
  

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

  newUnavailability(createdBooking: Availability): Observable<{message: string, status: string, time: string} | Availability> {
    
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
  
  public getBookings(): void{
    this.http.get<BookingDTO[]>(`${BACKEND_URL_PREFIX}/api/myBookingGuest`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    ).subscribe(data => {
      console.log(data);
      this.bookingsSubject.next(data);
    });
}
}
