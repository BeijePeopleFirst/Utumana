import { Injectable } from '@angular/core';
import { BookingDTO } from '../dtos/bookingDTO';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookingsSubject = new BehaviorSubject<BookingDTO[] | null>(null);
  public bookings$ = this.bookingsSubject.asObservable();

  constructor(private http: HttpClient) { }

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
