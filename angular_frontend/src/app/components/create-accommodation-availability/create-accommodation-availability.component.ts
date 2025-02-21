import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BookingDTO } from 'src/app/dtos/bookingDTO';
import { Availability } from 'src/app/models/availability';

interface TmpAvailability {
  start_date: string, 
  end_date: string, 
  price_per_night: number
}

@Component({
  selector: 'app-create-accommodation-availability',
  templateUrl: './create-accommodation-availability.component.html',
  styleUrls: ['./create-accommodation-availability.component.css']
})
export class CreateAccommodationAvailabilityComponent implements OnInit, OnDestroy {
  availabilities: TmpAvailability[] = JSON.parse(localStorage.getItem('new_acc_avail') || '[]');
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
    private translateService: TranslateService
  ){
    this.availForm = this.fb.group({
      start_avail: ['', Validators.required],
      end_avail: ['', Validators.required],
      price: ['0.00', Validators.required],
    });
    this.unavailForm = this.fb.group({
      check_in: ['', Validators.required],
      check_out: ['', Validators.required],
    });

    console.log(this.availabilities);
  }

  ngOnInit(): void {
    this.localeSubscription = this.translateService.onLangChange.subscribe(
      event => this.locale = event.lang.slice(0,2));
  }

  ngOnDestroy(): void {
    this.save();
    if(this.localeSubscription)
      this.localeSubscription.unsubscribe();
  }

  save(): void {
    localStorage.setItem('new_acc_avail', JSON.stringify(this.availabilities));
    localStorage.setItem('new_acc_unavail', JSON.stringify(this.unavailabilities));
    // TODO
    // save availabilities and unavailabilities in draft in db
  }

  saveAndContinue(): void {
    this.router.navigate(['/create/info']);
  }
  goBack(): void{
    this.router.navigate(['/create/services']);
  }

  areDatesInOrder(start: string, end: string): boolean {
    if(!start || !end){
      return false;
    }
    console.log(start, "->", Date.parse(start));
    console.log(end, "->", Date.parse(end));
    return Date.parse(start) < Date.parse(end);
  }

  isLatestAvailabilityOk(availability: TmpAvailability): boolean {
    this.invalidDates = !this.areDatesInOrder(availability.start_date, availability.end_date);
    if(this.invalidDates === false){
      return false;
    }
    this.invalidAvailability = false; // todo
    console.log(this.invalidDates, this.invalidAvailability);
    return false;
  }

  addAvailability(): void{
    if(this.availForm.invalid){
      this.isAvailSubmitted = true;
      return;
    }

    let new_acc_avail: TmpAvailability = {
      start_date: this.availForm.value.start_avail, 
      end_date: this.availForm.value.end_avail, 
      price_per_night: Number(this.availForm.value.price)
    };
    if(!this.isLatestAvailabilityOk(new_acc_avail)){
      return;
    }

    this.availabilities.push(new_acc_avail);
    this.availabilities.sort((a, b) => a.start_date.localeCompare(b.start_date));
    localStorage.setItem('new_acc_avail', JSON.stringify(this.availabilities));
    
    this.availForm.reset();
    this.availForm.get('price')?.setValue('0.00');
    this.isAvailSubmitted = false;
  }

  removeAvailability(availability: TmpAvailability): void{
    this.availabilities = this.availabilities.filter(a => a.start_date !== availability.start_date);
    localStorage.setItem('new_acc_avail', JSON.stringify(this.availabilities));
  }
}
