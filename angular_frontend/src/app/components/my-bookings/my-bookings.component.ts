import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
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
  bgColor = 'bg-neutral-2';
  subscriptions: Subscription = new Subscription();

  acceptedBookings$!:Observable<BookingDTO[]>;
  allAcceptedBookings!: BookingDTO[];
  acceptedBookingsPageSize!: number;
  acceptedBookingsPageNumber!: number;
  acceptedBookingsTotalPages!: number;
  
  rejectedBookings$!:Observable<BookingDTO[]>;
  allRejectedBookings!: BookingDTO[];
  rejectedBookingsPageSize!: number;
  rejectedBookingsPageNumber!: number;
  rejectedBookingsTotalPages!: number;

  doneBookings$!:Observable<BookingDTO[]>;
  allDoneBookings!: BookingDTO[];
  doneBookingsPageSize!: number;
  doneBookingsPageNumber!: number;
  doneBookingsTotalPages!: number;

  pendingBookings$!:Observable<BookingDTO[]>;
  allPendingBookings!: BookingDTO[];
  pendingBookingsPageSize!: number;
  pendingBookingsPageNumber!: number;
  pendingBookingsTotalPages!: number;

  doingBookings$!:Observable<BookingDTO[]>;
  allDoingBookings!: BookingDTO[];
  doingBookingsPageSize!: number;
  doingBookingsPageNumber!: number;
  doingBookingsTotalPages!: number;

  isModalOpen:boolean=false;
  selectedBookingId:number=-1;

    constructor(
      private router: Router,
      private bookingService:BookingService
    ){ }

  ngOnInit(): void {
    this.loadAcceptedBookings();

    this.loadRejectedBookings();

    this.loadDoneBookings();

    this.loadPendingBookings();

    this.loadDoingBookings();
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }

  closeWriteReviewModal() {
    this.isModalOpen = false;
    this.selectedBookingId = -1
    document.body.style.overflow = 'auto';
  }

  onWriteReview(bookingId: number) {
    this.selectedBookingId = bookingId;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
    console.log(bookingId);
  }

  onReviewAdded() {
    this.loadDoneBookings();
    this.closeWriteReviewModal();
  }

  loadDoneBookings(){
    this.doneBookingsPageSize = 2;
    this.doneBookingsPageNumber = 0;

    this.bookingService.getDoneBookings().subscribe(doneBookings => {
          this.doneBookingsTotalPages = Math.ceil( doneBookings.length / this.doneBookingsPageSize );
          this.allDoneBookings = doneBookings;
          this.doneBookings$ = of(doneBookings.slice(0, this.doneBookingsPageSize));
        });

  }

  loadAcceptedBookings(){
    this.acceptedBookingsPageSize = 4;
    this.acceptedBookingsPageNumber = 0;

    this.bookingService.getAcceptedBookings().subscribe(acceptedBookings => {
      this.acceptedBookingsTotalPages = Math.ceil( acceptedBookings.length / this.acceptedBookingsPageSize );
      this.allAcceptedBookings = acceptedBookings;
      this.acceptedBookings$ = of(acceptedBookings.slice(0, this.acceptedBookingsPageSize));
    });

  }

  loadRejectedBookings(){
    this.rejectedBookingsPageSize = 2;
    this.rejectedBookingsPageNumber = 0;

    this.bookingService.getRejectedBookings().subscribe(rejectedBookings => {
      this.rejectedBookingsTotalPages = Math.ceil( rejectedBookings.length / this.rejectedBookingsPageSize );
      this.allRejectedBookings = rejectedBookings;
      this.rejectedBookings$ = of(rejectedBookings.slice(0, this.rejectedBookingsPageSize));
    });

  }

  loadDoingBookings(){
    this.doingBookingsPageSize = 2;
    this.doingBookingsPageNumber = 0;

    this.bookingService.getDoingBookings().subscribe(doingBookings => {
      this.doingBookingsTotalPages = Math.ceil( doingBookings.length / this.doingBookingsPageSize );
      this.allDoingBookings = doingBookings;
      this.doingBookings$ = of(doingBookings.slice(0, this.doingBookingsPageSize));
    });
  }

  loadPendingBookings(){
    this.pendingBookingsPageSize = 4;
    this.pendingBookingsPageNumber = 0;

    this.bookingService.getPendingBookings().subscribe(pendingBookings => {
      this.pendingBookingsTotalPages = Math.ceil( pendingBookings.length / this.pendingBookingsPageSize );
      this.allPendingBookings = pendingBookings;
      this.pendingBookings$ = of(pendingBookings.slice(0, this.pendingBookingsPageSize));
    });
  }

  loadDoingBookingsPage(pageNumber: number): void {
    this.doingBookingsPageNumber = pageNumber;
    let offset = this.doingBookingsPageNumber * this.doingBookingsPageSize;
    this.doingBookings$ = of(this.allDoingBookings.slice(offset, offset + this.doingBookingsPageSize));
  }

  loadPendingBookingsPage(pageNumber: number): void {
    this.pendingBookingsPageNumber = pageNumber;
    let offset = this.pendingBookingsPageNumber * this.pendingBookingsPageSize;
    this.pendingBookings$ = of(this.allPendingBookings.slice(offset, offset + this.pendingBookingsPageSize));
  }

  loadDoneBookingsPage(pageNumber: number): void {
    this.doneBookingsPageNumber = pageNumber;
    let offset = this.doneBookingsPageNumber * this.doneBookingsPageSize;
    this.doneBookings$ = of(this.allDoneBookings.slice(offset, offset + this.doneBookingsPageSize));
  }

  loadAcceptedBookingsPage(pageNumber: number): void {
    this.acceptedBookingsPageNumber = pageNumber;
    let offset = this.acceptedBookingsPageNumber * this.acceptedBookingsPageSize;
    this.acceptedBookings$ = of(this.allAcceptedBookings.slice(offset, offset + this.acceptedBookingsPageSize));
  }

  loadRejectedBookingsPage(pageNumber: number): void {
    this.rejectedBookingsPageNumber = pageNumber;
    let offset = this.rejectedBookingsPageNumber * this.rejectedBookingsPageSize;
    this.rejectedBookings$ = of(this.allRejectedBookings.slice(offset, offset + this.rejectedBookingsPageSize));
  }
  
  changeBgColor(): string {
    this.bgColor === 'bg-neutral-1' ? this.bgColor = 'bg-neutral-2' : this.bgColor = 'bg-neutral-1';
    return this.bgColor;
  }
}
