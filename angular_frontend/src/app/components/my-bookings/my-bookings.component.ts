import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingDTO } from 'src/app/dtos/bookingDTO';
import { BookingService } from 'src/app/services/booking.service';

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

    bookings$:BookingDTO[] |null = null;

  ngOnInit(): void {
    this.BookingService.getBookings();
    this.BookingService.bookings$.subscribe(bookings => this.bookings$ = bookings);
  }
}
