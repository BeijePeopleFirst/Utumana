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
      private BookingService:BookingService
    ){ }

  ngOnInit(): void {

    this.BookingService.getBookings();
    
    this.acceptedBookings$ = this.BookingService.acceptedBookings$;
    this.acceptedBookingsPageSize = 4;
    this.acceptedBookingsPageNumber = 0;
    this.acceptedBookingsTotalPages = 2; // latest accommodation pages that the user can look at
    this.loadAcceptedBookingsPage(0);

    this.rejectedBookings$ = this.BookingService.rejectedBookings$;
    this.rejectedBookingsPageSize = 4;
    this.rejectedBookingsPageNumber = 0;
    this.rejectedBookingsTotalPages = 2; // latest accommodation pages that the user can look at
    this.loadRejectedBookingsPage(0);

    this.doneBookings$ = this.BookingService.doneBookings$;
    this.doneBookingsPageSize = 4;
    this.doneBookingsPageNumber = 0;
    this.doneBookingsTotalPages = 2; // latest accommodation pages that the user can look at
    this.loadDoneBookingsPage(0);

    this.pendingBookings$ = this.BookingService.pendingBookings$;
    this.pendingBookingsPageSize = 4;
    this.pendingBookingsPageNumber = 0;
    this.pendingBookingsTotalPages = 2; // latest accommodation pages that the user can look at
    this.loadPendingBookingsPage(0);

    this.doingBookings$ = this.BookingService.doingBookings$;
    this.doingBookingsPageSize = 4;
    this.doingBookingsPageNumber = 0;
    this.doingBookingsTotalPages = 2; // latest accommodation pages that the user can look at
    this.loadDoingBookingsPage(0);
  }

  loadDoneBookingsPage(pageNumber: number): void {
    this.doneBookingsPageNumber = pageNumber;
    this.BookingService.getDoneBookings(this.doneBookingsPageNumber * this.doneBookingsPageSize, this.doneBookingsPageSize);
  }

  loadPendingBookingsPage(pageNumber: number): void {
    this.pendingBookingsPageNumber = pageNumber;
    this.BookingService.getPendingBookings(this.pendingBookingsPageNumber * this.pendingBookingsPageSize, this.pendingBookingsPageSize);
  }

  loadRejectedBookingsPage(pageNumber: number): void {
    this.rejectedBookingsPageNumber = pageNumber;
    this.BookingService.getRejectedBookings(this.rejectedBookingsPageNumber * this.rejectedBookingsPageSize, this.rejectedBookingsPageSize);
  }

  loadAcceptedBookingsPage(pageNumber: number): void {
    this.acceptedBookingsPageNumber = pageNumber;
    this.BookingService.getAcceptedBookings(this.acceptedBookingsPageNumber * this.acceptedBookingsPageSize, this.acceptedBookingsPageSize);
  }

  loadDoingBookingsPage(pageNumber: number): void {
    this.doingBookingsPageNumber = pageNumber;
    this.BookingService.getDoingBookings(this.doingBookingsPageNumber * this.doingBookingsPageSize, this.doingBookingsPageSize);
  }

}
