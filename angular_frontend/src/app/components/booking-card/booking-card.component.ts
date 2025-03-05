import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { BookingDTO } from 'src/app/dtos/bookingDTO';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.css']
})
export class BookingCardComponent implements OnInit, OnDestroy {
  @Input() booking:BookingDTO | null=null;
  locale: string = 'en';
  localeSubscription?: Subscription;
  bookingId!: number;

  @Input() isOwner?: boolean;
  @Output() selectBooking = new EventEmitter<number>();

  constructor(private translateService: TranslateService, private bookingService: BookingService, private router: Router){ }
  
  ngOnInit(): void {
    this.localeSubscription = this.translateService.onLangChange.subscribe(event => this.locale = event.lang.slice(0,2));
    if(this.isOwner == undefined) this.isOwner = false;
    this.bookingId = this.booking!.id!;
  }

  ngOnDestroy(): void {
    if(this.localeSubscription)
      this.localeSubscription.unsubscribe();
  }

  selectCard() {
    this.selectBooking.emit(this.booking?.id);
  }

  manageBooking(action: string) {
    this.bookingService.manageBooking(this.bookingId, action).subscribe({
      next: () => this.router.navigate(['/host_dashboard'])
    });
  }
}
