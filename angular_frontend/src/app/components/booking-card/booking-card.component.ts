import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { BookingDTO } from 'src/app/dtos/bookingDTO';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.css']
})
export class BookingCardComponent implements OnInit, OnDestroy {
  @Input() booking:BookingDTO | null=null;
  locale: string = 'en';
  localeSubscription?: Subscription;

  constructor(private translateService: TranslateService){ }
  
  ngOnInit(): void {
    this.localeSubscription = this.translateService.onLangChange.subscribe(event => this.locale = event.lang.slice(0,2));
  }

  ngOnDestroy(): void {
    if(this.localeSubscription)
      this.localeSubscription.unsubscribe();
  }
}
