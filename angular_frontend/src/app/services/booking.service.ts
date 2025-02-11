import { Injectable } from '@angular/core';
import { BookingDTO } from '../dtos/bookingDTO';
import { BehaviorSubject, catchError, of, Subject } from 'rxjs';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) { }

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
