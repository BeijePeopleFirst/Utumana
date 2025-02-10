import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingDTO } from 'src/app/dtos/bookingDTO';
import { BookingService } from 'src/app/services/booking.service';
import { BookingStatus } from 'src/app/utils/enums';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent {

    constructor(
      private router: Router,
      private BookingService:BookingService
    ){ }

    acceptedBookings$:BookingDTO[] |null = null;
    rejectedBookings$:BookingDTO[] |null = null;
    doneBookings$:BookingDTO[] |null = null;
    pendingBookings$:BookingDTO[] |null = null;
    doingBookings$:BookingDTO[] |null = null;

  ngOnInit(): void {
    this.BookingService.getBookings();
    this.BookingService.bookings$.subscribe(bookings => {
      this.acceptedBookings$ = (bookings) ? bookings.filter(booking => booking.status === "ACCEPTED") : null;
      this.rejectedBookings$ = (bookings) ? bookings.filter(booking => booking.status === "REJECTED") : null;
      this.doneBookings$ = (bookings) ? bookings.filter(booking => booking.status === "DONE") : null;
      this.pendingBookings$ = (bookings) ? bookings.filter(booking => booking.status === "PENDING") : null;
      this.doingBookings$ = (bookings) ? bookings.filter(booking => booking.status === "DOING") : null;
    });
  }
}
