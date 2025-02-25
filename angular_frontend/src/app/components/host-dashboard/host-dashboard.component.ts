import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BookingDTO } from 'src/app/dtos/bookingDTO';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-host-dashboard',
  templateUrl: './host-dashboard.component.html',
  styleUrls: ['./host-dashboard.component.css']
})
export class HostDashboardComponent implements OnInit {
  readonly PAGE_SIZE = 2;
  bgColor = 'bg-neutral-2';
  
  bookings$!: Observable<BookingDTO[]>;
  allHostBookings!: BookingDTO[];
  bookingsPageSize!: number;
  bookingsPageNumber!: number;
  bookingsTotalPages!: number;

  pendingBookings$!: Observable<BookingDTO[]>;
  allPendingBookings!: BookingDTO[];
  pendingBookingsPageSize!: number;
  pendingBookingsPageNumber!: number;
  pendingBookingsTotalPages!: number;

  rejectedBookings$!: Observable<BookingDTO[]>;
  allRejectedBookings!: BookingDTO[];
  rejectedBookingsPageSize!: number;
  rejectedBookingsPageNumber!: number;
  rejectedBookingsTotalPages!: number;

  doingBookings$!: Observable<BookingDTO[]>;
  allDoingBookings!: BookingDTO[];
  doingBookingsPageSize!: number;
  doingBookingsPageNumber!: number;
  doingBookingsTotalPages!: number;

  acceptedBookings$!: Observable<BookingDTO[]>;
  allAcceptedBookings!: BookingDTO[];
  acceptedBookingsPageSize!: number;
  acceptedBookingsPageNumber!: number;
  acceptedBookingsTotalPages!: number;

  doneBookings$!: Observable<BookingDTO[]>;
  allDoneBookings!: BookingDTO[];
  doneBookingsPageSize!: number;
  doneBookingsPageNumber!: number;
  doneBookingsTotalPages!: number;

  constructor(private bookingService: BookingService) {
    this.bookings$ = new Observable<BookingDTO[]>();
    this.pendingBookings$ = new Observable<BookingDTO[]>();
    this.rejectedBookings$ = new Observable<BookingDTO[]>();
    this.doingBookings$ = new Observable<BookingDTO[]>();
    this.acceptedBookings$ = new Observable<BookingDTO[]>();
    this.doneBookings$ = new Observable<BookingDTO[]>();
  }

  ngOnInit(): void {
    this.bookingService.bookingUpdated$.subscribe(() => {
      this.loadAllHostBookings();
    });
    this.loadAllHostBookings();
  }

  loadAllHostBookings() {
    this.bookingService.getAllBookingsHost().subscribe((data) => {
      this.allHostBookings = data;
  
      this.allPendingBookings = this.allHostBookings.filter((b) => b.status === 'PENDING');
      this.allRejectedBookings = this.allHostBookings.filter((b) => b.status === 'REJECTED');
      this.allDoingBookings = this.allHostBookings.filter((b) => b.status === 'DOING');
      this.allAcceptedBookings = this.allHostBookings.filter((b) => b.status === 'ACCEPTED');
      this.allDoneBookings = this.allHostBookings.filter((b) => b.status === 'DONE');
  
      this.pendingBookingsPageSize = this.PAGE_SIZE;
      this.rejectedBookingsPageSize = this.PAGE_SIZE;
      this.doingBookingsPageSize = this.PAGE_SIZE;
      this.acceptedBookingsPageSize = this.PAGE_SIZE;
      this.doneBookingsPageSize = this.PAGE_SIZE;
  
      this.pendingBookingsTotalPages = Math.ceil(this.allPendingBookings.length / this.PAGE_SIZE);
      this.rejectedBookingsTotalPages = Math.ceil(this.allRejectedBookings.length / this.PAGE_SIZE);
      this.doingBookingsTotalPages = Math.ceil(this.allDoingBookings.length / this.PAGE_SIZE);
      this.acceptedBookingsTotalPages = Math.ceil(this.allAcceptedBookings.length / this.PAGE_SIZE);
      this.doneBookingsTotalPages = Math.ceil(this.allDoneBookings.length / this.PAGE_SIZE);
  
      this.loadPendingBookingsPage(0);
      this.loadRejectedBookingsPage(0);
      this.loadDoingBookingsPage(0);
      this.loadAcceptedBookingsPage(0);
      this.loadDoneBookingsPage(0);
    });
  }

  loadPendingBookingsPage(pageNumber: number): void {
    this.pendingBookingsPageNumber = pageNumber;
    let offset = this.pendingBookingsPageNumber * this.pendingBookingsPageSize;
    console.log("this.allPendingBookings", this.allPendingBookings)
    this.pendingBookings$ = of(this.allPendingBookings.slice(offset, offset + this.pendingBookingsPageSize));
  }

  loadRejectedBookingsPage(pageNumber: number): void {
    this.rejectedBookingsPageNumber = pageNumber;
    let offset = this.rejectedBookingsPageNumber * this.rejectedBookingsPageSize;
    this.rejectedBookings$ = of(this.allRejectedBookings.slice(offset, offset + this.rejectedBookingsPageSize));
  }

  loadDoingBookingsPage(pageNumber: number): void {
    this.doingBookingsPageNumber = pageNumber;
    let offset = this.doingBookingsPageNumber * this.doingBookingsPageSize;
    this.doingBookings$ = of(this.allDoingBookings.slice(offset, offset + this.doingBookingsPageSize));
  }

  loadAcceptedBookingsPage(pageNumber: number): void {
    this.acceptedBookingsPageNumber = pageNumber;
    let offset = this.acceptedBookingsPageNumber * this.acceptedBookingsPageSize;
    this.acceptedBookings$ = of(this.allAcceptedBookings.slice(offset, offset + this.acceptedBookingsPageSize));
  }

  loadDoneBookingsPage(pageNumber: number): void {
    this.doneBookingsPageNumber = pageNumber;
    let offset = this.doneBookingsPageNumber * this.doneBookingsPageSize;
    this.doneBookings$ = of(this.allDoneBookings.slice(offset, offset + this.doneBookingsPageSize));
  }

  changeBgColor(): string {
    this.bgColor === 'bg-neutral-1' ? this.bgColor = 'bg-neutral-2' : this.bgColor = 'bg-neutral-1';
    return this.bgColor;
  }
}
