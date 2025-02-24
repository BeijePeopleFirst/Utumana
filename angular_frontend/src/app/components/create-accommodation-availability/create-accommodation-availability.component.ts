import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BookingDTO } from 'src/app/dtos/bookingDTO';
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
  unavailabilities: BookingDTO[] = JSON.parse(localStorage.getItem('new_acc_unavail') || '[]');

  invalidAvailability: boolean = false;
  invalidDates: boolean = false;
  availForm: FormGroup;
  isAvailSubmitted: boolean = false;
  unavailForm: FormGroup;
  isUnavailSubmitted: boolean = false;

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
    this.unavailForm = this.fb.group({
      check_in: ['', Validators.required],
      check_out: ['', Validators.required],
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
    })
  }

  ngOnDestroy(): void {
    this.save();
    if(this.localeSubscription)
      this.localeSubscription.unsubscribe();
  }

  save(): void {
    //localStorage.setItem('new_acc_avail', JSON.stringify(this.availabilities));
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
    console.log(start, "->", Date.parse(start));
    console.log(end, "->", Date.parse(end));
    return Date.parse(start) < Date.parse(end);
  }

  areDatesInOrderOrEqual(start: string, end: string): boolean {
    if(!start || !end){
      return false;
    }
    console.log(start, "->", Date.parse(start));
    console.log(end, "->", Date.parse(end));
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
    //localStorage.setItem('new_acc_avail', JSON.stringify(this.availabilities));
    this.draftService.setAvailabilities(this.availabilities, this.draftId);
    
    this.availForm.reset();
    this.availForm.get('price')?.setValue('0.00');
    this.isAvailSubmitted = false;
  }

  removeAvailability(availability: AvailabilityInterface): void{
    this.availabilities = this.availabilities.filter(a => a.start_date !== availability.start_date);
    //localStorage.setItem('new_acc_avail', JSON.stringify(this.availabilities));
    this.draftService.setAvailabilities(this.availabilities, this.draftId);
  }
}
