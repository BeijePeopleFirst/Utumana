import { Component, Input } from '@angular/core';
import { BookingDTO } from 'src/app/dtos/bookingDTO';

@Component({
  selector: 'app-booking-cards',
  templateUrl: './booking-cards.component.html',
  styleUrls: ['./booking-cards.component.css']
})
export class BookingCardsComponent {
  @Input() bookings:BookingDTO[] | null=null;

  
}
