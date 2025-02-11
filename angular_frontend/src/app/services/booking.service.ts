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

  public getBookings(): void{
    this.http.get<BookingDTO[]>(`${BACKEND_URL_PREFIX}/api/myBookingGuest`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    ).subscribe(bookings => {

      this.doingBookingsSubject.next(bookings.filter(booking => booking.status === "ACCEPTED"));
      this.rejectedBookingsSubject.next(bookings.filter(booking => booking.status === "REJECTED"));
      this.doneBookingsSubject.next(bookings.filter(booking => booking.status === "DONE"));
      this.pendingBookingsSubject.next(bookings.filter(booking => booking.status === "PENDING"));
      this.doingBookingsSubject.next(bookings.filter(booking => booking.status === "DOING"));
    });

  }

  public getDoneBookings(offset: number, pageSize: number):void{
    
  }

  public getPendingBookings(offset: number, pageSize: number):void{
    
  }

  public getRejectedBookings(offset: number, pageSize: number):void{
    
  }

  public getAcceptedBookings(offset: number, pageSize: number):void{
    
  }

  public getDoingBookings(offset: number, pageSize: number):void{
    
  }
}
