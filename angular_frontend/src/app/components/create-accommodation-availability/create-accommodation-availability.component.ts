import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BookingDTO } from 'src/app/dtos/bookingDTO';
import { UnavailabilityDTO, UnavailabilityInterface } from 'src/app/dtos/unavailabilityDTO';
import { Availability, AvailabilityInterface } from 'src/app/models/availability';
import { DraftService } from 'src/app/services/draft.service';

@Component({
  selector: 'app-create-accommodation-availability',
  templateUrl: './create-accommodation-availability.component.html',
  styleUrls: ['./create-accommodation-availability.component.css']
})
export class CreateAccommodationAvailabilityComponent implements OnInit, OnDestroy {
  draftId: number;
  genericError: boolean = false;
  availabilities!: AvailabilityInterface[];
  unavailabilities!: UnavailabilityInterface[];

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
    private router: Router,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private draftService: DraftService
  ) {
    this.draftId = this.route.snapshot.params['draftId'];
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

    this.draftService.getAvailabilities(this.draftId).subscribe(availabilities => {
      if(!availabilities){
        this.genericError = true;
        return;
      }
      this.availabilities = availabilities;
    });

    this.draftService.getUnavailabilities(this.draftId).subscribe(unavailabilities => {
      if(!unavailabilities){
        this.genericError = true;
        return;
      }
      this.unavailabilities = unavailabilities;
    })
  }

  ngOnDestroy(): void {
    this.save();
    if(this.localeSubscription)
      this.localeSubscription.unsubscribe();
  }

  save(): void {
    localStorage.setItem('new_acc_unavail', JSON.stringify(this.unavailabilities));

    // save availabilities and unavailabilities in draft in db
    this.draftService.setAvailabilities(this.availabilities, this.draftId);
    // TODO
    //this.draftService.setUnavailabilities(this.unavailabilities, this.draftId);
  }

  saveAndContinue(): void {
    this.router.navigate(['/create/info/', this.draftId]);
  }
  goBack(): void{
    this.router.navigate(['/create/services/', this.draftId]);
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

  isLatestAvailabilityOk(availability: AvailabilityInterface): boolean {
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

    let new_acc_avail: AvailabilityInterface = {
      start_date: this.availForm.value.start_avail, 
      end_date: this.availForm.value.end_avail, 
      price_per_night: Number(this.availForm.value.price)
    };
    if(!this.isLatestAvailabilityOk(new_acc_avail)){
      return;
    }
    console.log("Adding availability:", new_acc_avail);

    this.availabilities.push(new_acc_avail);
    this.availabilities.sort((a, b) => a.start_date.localeCompare(b.start_date));
    this.draftService.setAvailabilities(this.availabilities, this.draftId);
    
    this.availForm.reset();
    this.availForm.get('price')?.setValue('0.00');
    this.isAvailSubmitted = false;
  }

  removeAvailability(availability: AvailabilityInterface): void{
    this.availabilities = this.availabilities.filter(a => a.start_date !== availability.start_date);
    this.draftService.setAvailabilities(this.availabilities, this.draftId);
  }

  isLatestUnavailabilityOk(unavailability: UnavailabilityInterface): boolean {
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

    let new_acc_unav: UnavailabilityInterface = {
      check_in: this.unavForm.value.start_unav + "T14:00:00", 
      check_out: this.unavForm.value.end_unav + "T10:00:00"
    };
    if(!this.isLatestUnavailabilityOk(new_acc_unav)){
      return;
    }
    console.log("Adding unavailability:", new_acc_unav);

    this.unavailabilities.push(new_acc_unav);
    this.unavailabilities.sort((a, b) => a.check_in.localeCompare(b.check_in));
    this.draftService.setUnavailabilities(this.unavailabilities, this.draftId);
    
    this.unavForm.reset();
    this.isUnavSubmitted = false;
  }

  removeUnavailability(unavailability: UnavailabilityInterface): void{
    this.unavailabilities = this.unavailabilities.filter(u => u.check_in !== unavailability.check_in);
    this.draftService.setUnavailabilities(this.unavailabilities, this.draftId);
  }
}
