import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { BookingDTO } from 'src/app/dtos/bookingDTO';
import { BookingService } from 'src/app/services/booking.service';
import { BookingStatus } from 'src/app/utils/enums';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent {

  acceptedBookings$!:Observable<BookingDTO[]>;
  acceptedBookingsPageSize!: number;
  acceptedBookingsPageNumber!: number;
  acceptedBookingsTotalPages!: number;
  
  rejectedBookings$!:Observable<BookingDTO[]>;
  rejectedBookingsPageSize!: number;
  rejectedBookingsPageNumber!: number;
  rejectedBookingsTotalPages!: number;

  doneBookings$!:Observable<BookingDTO[]>;
  doneBookingsPageSize!: number;
  doneBookingsPageNumber!: number;
  doneBookingsTotalPages!: number;

  pendingBookings$!:Observable<BookingDTO[]>;
  pendingBookingsPageSize!: number;
  pendingBookingsPageNumber!: number;
  pendingBookingsTotalPages!: number;

  doingBookings$!:Observable<BookingDTO[]>;
  doingBookingsPageSize!: number;
  doingBookingsPageNumber!: number;
  doingBookingsTotalPages!: number;

    constructor(
      private router: Router,
      private bookingService:BookingService
    ){ }

  ngOnInit(): void {
    
    this.acceptedBookings$ = this.bookingService.acceptedBookings$;
    this.acceptedBookingsPageSize = 4;
    this.acceptedBookingsPageNumber = 0;
    this.acceptedBookingsTotalPages = 2;
    this.loadAcceptedBookingsPage(0);

    this.rejectedBookings$ = this.bookingService.rejectedBookings$;
    this.rejectedBookingsPageSize = 2;
    this.rejectedBookingsPageNumber = 0;
    this.rejectedBookingsTotalPages = 2;
    this.loadRejectedBookingsPage(0);

    this.doneBookings$ = this.bookingService.doneBookings$;
    this.doneBookingsPageSize = 2;
    this.doneBookingsPageNumber = 0;
    this.doneBookingsTotalPages = 4;
    this.loadDoneBookingsPage(0);

    this.pendingBookings$ = this.bookingService.pendingBookings$;
    this.pendingBookingsPageSize = 4;
    this.pendingBookingsPageNumber = 0;
    this.pendingBookingsTotalPages = 2;
    this.loadPendingBookingsPage(0);

    this.doingBookings$ = this.bookingService.doingBookings$;
    this.doingBookingsPageSize = 2;
    this.doingBookingsPageNumber = 0;
    this.doingBookingsTotalPages = 1; // only one page for the only possible ongoing booking
    this.loadDoingBookingsPage(0);
  }

  loadDoneBookingsPage(pageNumber: number): void {
    this.doneBookingsPageNumber = pageNumber;
    this.bookingService.getDoneBookings(this.doneBookingsPageNumber * this.doneBookingsPageSize, this.doneBookingsPageSize);
  }

  loadPendingBookingsPage(pageNumber: number): void {
    this.pendingBookingsPageNumber = pageNumber;
    this.bookingService.getPendingBookings(this.pendingBookingsPageNumber * this.pendingBookingsPageSize, this.pendingBookingsPageSize);
  }

  loadRejectedBookingsPage(pageNumber: number): void {
    this.rejectedBookingsPageNumber = pageNumber;
    this.bookingService.getRejectedBookings(this.rejectedBookingsPageNumber * this.rejectedBookingsPageSize, this.rejectedBookingsPageSize);
  }

  loadAcceptedBookingsPage(pageNumber: number): void {
    this.acceptedBookingsPageNumber = pageNumber;
    this.bookingService.getAcceptedBookings(this.acceptedBookingsPageNumber * this.acceptedBookingsPageSize, this.acceptedBookingsPageSize);
  }

  loadDoingBookingsPage(pageNumber: number): void {
    this.doingBookingsPageNumber = pageNumber;
    this.bookingService.getDoingBookings(this.doingBookingsPageNumber * this.doingBookingsPageSize, this.doingBookingsPageSize);
  }

}
