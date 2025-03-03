import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingDTO } from 'src/app/dtos/bookingDTO';

@Component({
  selector: 'app-booking-cards',
  templateUrl: './booking-cards.component.html',
  styleUrls: ['./booking-cards.component.css']
})
export class BookingCardsComponent {
  @Input() bookings$!: Observable<BookingDTO[] | null>;

  @Input() pageNumber!: number;
  @Input() totalPages!: number;
  @Input() isOwner?: boolean;
  @Output() askForPage = new EventEmitter<number>();
  @Output() bookingSelected = new EventEmitter<number>();

  prevPage(): void {
    this.getPage(this.pageNumber - 1);
  }

  nextPage(): void {
    this.getPage(this.pageNumber + 1);
  }

  getPage(n: number) {
    if(this.pageNumber != n){
      this.askForPage.emit(n);
    }
  }

  onBookingSelected(bookingId: number) {
    this.bookingSelected.emit(bookingId);
  }
}
