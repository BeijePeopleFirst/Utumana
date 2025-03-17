import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Unavailability } from 'src/app/dtos/unavailabilityDTO';
import { Accommodation } from 'src/app/models/accommodation';
import { Availability } from 'src/app/models/availability';
import { Booking } from 'src/app/models/booking';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { BookingService } from 'src/app/services/booking.service';
import { BookingStatus } from 'src/app/utils/enums';

@Component({
  selector: 'app-edit-availabilities-accommodation-details',
  templateUrl: './edit-availabilities-accommodation-details.component.html',
  styleUrls: ['./edit-availabilities-accommodation-details.component.css']
})
export class EditAvailabilitiesAccommodationDetailsComponent implements OnInit {

  @Input() accommodation!: Accommodation;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  private edited: boolean= false;

  @Output() errorOccurred: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  genericError: boolean = false;
  availabilities!: Availability[];
  unavailabilities!: Unavailability[];

  invalidAvailability: boolean = false;
  invalidDates: boolean = false;
  availForm: FormGroup;
  isAvailSubmitted: boolean = false;

  invalidUnavailability: boolean = false;
  invalidUnavDates: boolean = false;
  unavForm: FormGroup;
  isUnavSubmitted: boolean = false;

  locale: string = 'en';
  localeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private accommodationService: AccommodationService,
    private bookingService: BookingService
  ) {
    this.availForm = this.fb.group({
      start_avail: ['', Validators.required],
      end_avail: ['', Validators.required],
      price: ['0.00', Validators.required],
    });
    this.unavForm = this.fb.group({
      start_unav: ['', Validators.required],
      end_unav: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.localeSubscription = this.translateService.onLangChange.subscribe(
      event => this.locale = event.lang.slice(0,2));

    this.accommodationService.getAllAvailabilities(this.accommodation.id!).subscribe(availabilities => {
      if(!availabilities || (availabilities && "message" in availabilities)){
        this.genericError = true;
        this.errorOccurred.emit(true);
        return;
      }
      this.availabilities = availabilities;
    });

    this.accommodationService.getUnavailabilities(this.accommodation.id!).subscribe(unavailabilities => {
      if(!unavailabilities){
        this.genericError = true;
        this.errorOccurred.emit(true);
        return;
      }
      this.unavailabilities = unavailabilities;
    })
  }

  save(): void {
    // save availabilities and unavailabilities

    let unavailabilitiesAsBookings: Booking[] = this.createBookingArrayFromUnavailabilities(this.unavailabilities);
    
    this.bookingService.setUnavailabilities(unavailabilitiesAsBookings, this.accommodation.id!).subscribe(
      response => {
        if("message" in response) {
          console.error(response.message);

          this.errorOccurred.emit(true);
          return;
        }

        this.edited = true;

        this.accommodationService.setAvailabilities(this.availabilities, this.accommodation.id!).subscribe(
          oth => {
            if(oth && "message" in oth) {
              console.error(oth.message);
    
              this.errorOccurred.emit(true);
              return;
            }
          }
        );

      }
    );
  }

  areDatesInOrder(start: string, end: string): boolean {
    if(!start || !end){
      return false;
    }
    return Date.parse(start) < Date.parse(end);
  }

  areDatesInOrderOrEqual(start: string, end: string): boolean {
    if(!start || !end){
      return false;
    }
    return Date.parse(start) <= Date.parse(end);
  }

  isLatestAvailabilityOk(availability: Availability): boolean {
    // check that start date is before end date
    this.invalidDates = !this.areDatesInOrder(availability.start_date, availability.end_date);
    if(this.invalidDates === true){
      return false;
    }

    // check that new availability period doesn't overlap with existing availabilities
    for(let a of this.availabilities){
      if((this.areDatesInOrderOrEqual(a.start_date, availability.start_date) && this.areDatesInOrder(availability.start_date, a.end_date)) // new av start is inside existing availability
        || (this.areDatesInOrder(a.start_date, availability.end_date) && this.areDatesInOrderOrEqual(availability.end_date, a.end_date)) // new av end is inside existing availability
        || (this.areDatesInOrder(availability.start_date, a.start_date) && this.areDatesInOrder(a.end_date, availability.end_date)) // existing av is inside new av
      ){
        this.invalidAvailability = true;
        break;
      }
    }

    return !this.invalidDates && !this.invalidAvailability;
  }

  addAvailability(): void{
    if(this.availForm.invalid){
      this.isAvailSubmitted = true;
      return;
    }

    let new_acc_avail: Availability = {
      start_date: this.availForm.value.start_avail, 
      end_date: this.availForm.value.end_avail, 
      price_per_night: Number(this.availForm.value.price)
    };
    if(!this.isLatestAvailabilityOk(new_acc_avail)){
      return;
    }

    this.availabilities.push(new_acc_avail);
    this.availabilities.sort((a, b) => a.start_date.localeCompare(b.start_date));
    this.accommodationService.setAvailabilities(this.availabilities, this.accommodation.id!).subscribe(
      oth => {
        if(oth && "message" in oth) {
          console.error(oth.message);

          this.errorOccurred.emit(true);
          return;
        }
        
        this.edited = true;
      }
    );

    
    this.availForm.reset();
    this.availForm.get('price')?.setValue('0.00');
    this.isAvailSubmitted = false;
  }

  removeAvailability(availability: Availability): void{

    if(this.availabilities.length === 1) {
      this.errorOccurred.emit(true);
      return;
    }

    let support: Availability[] = this.availabilities.filter(a => a.start_date !== availability.start_date);
    this.accommodationService.setAvailabilities(support, this.accommodation.id!).subscribe(
      oth => {
        if(oth && "message" in oth) {
          console.error(oth.message);

          this.errorOccurred.emit(true);
          return;
        }
        
        this.availabilities = this.availabilities.filter(a => a.start_date !== availability.start_date);
        this.edited = true;

        this.accommodationService.getUnavailabilities(this.accommodation.id!).subscribe(unavailabilities => {
          if(!unavailabilities){
            this.genericError = true;
            this.errorOccurred.emit(true);
            return;
          }
          this.unavailabilities = unavailabilities;
        })
      }
    );
  }

  isLatestUnavailabilityOk(unavailability: Unavailability): boolean {
    // check that start date is before end date
    this.invalidUnavDates = !this.areDatesInOrder(unavailability.check_in, unavailability.check_out);
    if(this.invalidUnavDates === true){
      return false;
    }

    // check that new unavailability period doesn't overlap with existing unavailabilities
    for(let u of this.unavailabilities){
      if((this.areDatesInOrderOrEqual(u.check_in, unavailability.check_in) && this.areDatesInOrder(unavailability.check_in, u.check_out)) // new unav start is inside existing unavailability
        || (this.areDatesInOrder(u.check_in, unavailability.check_out) && this.areDatesInOrderOrEqual(unavailability.check_out, u.check_out)) // new unav end is inside existing unavailability
        || (this.areDatesInOrder(unavailability.check_in, u.check_in) && this.areDatesInOrder(u.check_out, unavailability.check_out)) // existing unav is inside new unav
      ){
        this.invalidUnavailability = true;
        break;
      }
    }

    return !this.invalidUnavDates && !this.invalidUnavailability;
  }

  addUnavailability(): void{
    if(this.unavForm.invalid){
      this.isUnavSubmitted = true;
      return;
    }

    let new_acc_unav: Unavailability = {
      check_in: this.unavForm.value.start_unav + "T14:00:00", 
      check_out: this.unavForm.value.end_unav + "T10:00:00"
    };
    if(!this.isLatestUnavailabilityOk(new_acc_unav)){
      return;
    }

    this.unavailabilities.push(new_acc_unav);
    this.unavailabilities.sort((a, b) => a.check_in.localeCompare(b.check_in));


    let unavailabilitiesAsBookings: Booking[] = this.createBookingArrayFromUnavailabilities(this.unavailabilities);
    
    this.bookingService.setUnavailabilities(unavailabilitiesAsBookings, this.accommodation.id!).subscribe(
      response => {
        if("message" in response) {
          console.error(response.message);

          this.errorOccurred.emit(true);
          return;
        }

        this.edited = true;
      }
    );
    
    this.unavForm.reset();
    this.isUnavSubmitted = false;
  }

  removeUnavailability(unavailability: Unavailability): void{
    this.unavailabilities = this.unavailabilities.filter(u => u.check_in !== unavailability.check_in);

    let unavailabilitiesAsBookings: Booking[] = this.createBookingArrayFromUnavailabilities(this.unavailabilities);
    
    this.bookingService.setUnavailabilities(unavailabilitiesAsBookings, this.accommodation.id!).subscribe(
      response => {
        if("message" in response) {
          console.error(response.message);

          this.errorOccurred.emit(true);
          return;
        }

        this.edited = true;
      }
    );
  }

  private createBookingArrayFromUnavailabilities(uns: Unavailability[]): Booking[] {
    let result: Booking[] = [];

    let temp: Booking;
    for(let u of uns) {
      temp = {
        accommodation: this.accommodation, 
        check_in: u.check_in, 
        check_out: u.check_out, 
        is_unavailability: true, 
        price: 0, 
        status: BookingStatus.ACCEPTED,
        timestamp: new Date(Date.now()).toISOString(),
        user_id: Number(localStorage.getItem("id")!)
      };
      result.push(temp);
    }

    return result;
  }
  
  confirmEdits(): void {
    this.closeModal.emit(this.edited);
  }

}
