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

  private acceptedBookingsSubject = new BehaviorSubject<BookingDTO[]>([]);
  public acceptedBookings$ = this.acceptedBookingsSubject.asObservable();

  private rejectedBookingsSubject = new BehaviorSubject<BookingDTO[]>([]);
  public rejectedBookings$ = this.rejectedBookingsSubject.asObservable();

  private doneBookingsSubject = new BehaviorSubject<BookingDTO[]>([]);
  public doneBookings$ = this.doneBookingsSubject.asObservable();

  private doingBookingsSubject = new BehaviorSubject<BookingDTO[]>([]);
  public doingBookings$ = this.doingBookingsSubject.asObservable();

  private pendingBookingsSubject = new BehaviorSubject<BookingDTO[]>([]);
  public pendingBookings$ = this.pendingBookingsSubject.asObservable();

  private bookingsSubject = new BehaviorSubject<BookingDTO[] | null>(null);


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
  
  public getBookings(url: string, offset: number, pageSize: number, subject: Subject<BookingDTO[]>): void{
    // TODO get page of results from backend
    this.http.get<BookingDTO[]>(url).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    ).subscribe(bookings => {
      console.log("Booking Service - Fetched bookings DTO:", bookings);
      subject.next(bookings.slice(offset, offset + pageSize));  // remove slice when result will be paginated by backend
    });
  }

  public getDoneBookings(offset: number, pageSize: number):void{
    this.getBookings(`${BACKEND_URL_PREFIX}/api/myBookingGuest?status=DONE`, offset, pageSize, this.doneBookingsSubject);
  }

  public getPendingBookings(offset: number, pageSize: number):void{
    this.getBookings(`${BACKEND_URL_PREFIX}/api/myBookingGuest?status=PENDING`, offset, pageSize, this.pendingBookingsSubject);
  }

  public getRejectedBookings(offset: number, pageSize: number):void{
    this.getBookings(`${BACKEND_URL_PREFIX}/api/myBookingGuest?status=REJECTED`, offset, pageSize, this.rejectedBookingsSubject);
  }

  public getAcceptedBookings(offset: number, pageSize: number):void{
    this.getBookings(`${BACKEND_URL_PREFIX}/api/myBookingGuest?status=ACCEPTED`, offset, pageSize, this.acceptedBookingsSubject);
  }

  public getDoingBookings(offset: number, pageSize: number):void{
    this.getBookings(`${BACKEND_URL_PREFIX}/api/myBookingGuest?status=DOING`, offset, pageSize, this.doingBookingsSubject);
  }
}
