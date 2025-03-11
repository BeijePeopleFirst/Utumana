import { FormStyle, TranslationWidth, getLocaleDayNames } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs';
import { PartialBooking } from 'src/app/dtos/bookingDTO';
import { Accommodation } from 'src/app/models/accommodation';
import { Availability } from 'src/app/models/availability';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-choose-book-period-from-acc-details',
  templateUrl: './choose-book-period-from-acc-details.component.html',
  styleUrls: ['./choose-book-period-from-acc-details.component.css']
})
export class ChooseBookPeriodFromAccDetailsComponent implements OnInit {

  @Input() accommodation!: Accommodation;
  @Output() sendChosenPeriod = new EventEmitter<PartialBooking | {message: string}>();

  @Input() queryParamsFromParent?: Params;

  @Input() availabilities!: string[];

  chosenOne: PartialBooking = {};

  currentMonth!: { name: string; days: number[]; monthIndex: number; year: number; firstDayIndex: number };
  previousMonth!: { name: string; days: number[]; monthIndex: number; year: number; firstDayIndex: number };

  // Weekday names for the calendar headers
  
  alreadySelectedStart: boolean = false;
  
  //availabilityCacheImproved: Map<string, boolean> = new Map<string, boolean>();
  selectedDays: Map<string, boolean> = new Map<string, boolean>();
  
  check_in_time: number = 14; // hours
  check_out_time: number = 10; // hours
  
  locale: string = 'en';
  localeSubscription?: Subscription;
  
  weekdays: readonly string[] = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Short);
  constructor(
    private accommodationService: AccommodationService,
    private translateService: TranslateService
  )
  {}

  sendBookingPeriod() {
    if(this.chosenOne == null) return;
    console.log("Sending booking period -> ", this.chosenOne);
    this.sendChosenPeriod.emit(this.chosenOne);
  }

  ngOnInit() {

    console.log("Availabilities received: ", this.availabilities);
    if(this.queryParamsFromParent && this.queryParamsFromParent["start_date"] && this.queryParamsFromParent["end_date"]) {
      this.chosenOne.check_in = new Date(this.queryParamsFromParent["start_date"]);
      this.chosenOne.check_in.setHours(this.check_in_time, 0, 0, 0);
      this.chosenOne.check_out = new Date(this.queryParamsFromParent["end_date"]);
      this.chosenOne.check_out.setHours(this.check_out_time, 0, 0, 0);
    }
    this.localeSubscription = this.translateService.onLangChange.subscribe(
      event =>  {
        this.locale = event.lang.slice(0,2);
        this.weekdays = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Short);
      }
    );


    this.initializeCalendars(new Date().getFullYear(), new Date().getMonth());
    this.navigateMonths(+1);
  }

  initializeCalendars(year: number, month: number) {
    this.currentMonth = this.getMonthData(year, month);
    const prevMonthIndex = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    this.previousMonth = this.getMonthData(prevYear, prevMonthIndex);
  }

  getMonthData(year: number, month: number) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1);
    const firstDayIndex = (firstDay.getDay()) ; // gerDay() 0 = Sunday, 1 = Monday, etc.
    
    return {
      name: monthNames[month],
      days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      monthIndex: month,
      year: year,
      firstDayIndex: firstDayIndex
    };
  }

  navigateMonths(direction: number) {
    let newMonth = this.currentMonth.monthIndex + direction;
    let newYear = this.currentMonth.year;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    this.initializeCalendars(newYear, newMonth);
  }

  selectDay(day: number, month: string, monthName: string, year: number) {
    if(!this.alreadySelectedStart) {
      this.chosenOne.check_in = new Date(this.accommodationService.fetchDate(day, monthName, year) + this.check_in_time*60*60*1000);
      this.alreadySelectedStart = true;
      this.sendBookingPeriod();
      return;
    }

    if(this.chosenOne.check_in && this.chosenOne.check_in.getTime() >= this.accommodationService.fetchDate(day, monthName, year)) {
      // // send error
      // if(this.translateService.currentLang === 'en-US') this.sendChosenPeriod.emit({message: "Start Date must be BEFORE End Date"});
      // if(this.translateService.currentLang === 'it-IT') this.sendChosenPeriod.emit({message: "La data di inizio deve essere precedente alla data di fine"});
      // return;

      // move check-in date
      this.chosenOne.check_in = new Date(this.accommodationService.fetchDate(day, monthName, year) + this.check_in_time*60*60*1000);
    }else{
      // set check-out date
      this.chosenOne.check_out = new Date(this.accommodationService.fetchDate(day, monthName, year) + this.check_out_time*60*60*1000);
    }

    this.getPriceInfoAndSendUpdatedPeriod();
  }

  getPriceInfoAndSendUpdatedPeriod(){
    this.chosenOne.price_info = [];

    this.accommodationService.getAvailabilities(this.accommodation).subscribe(
      response1 => {
        if("message" in response1) {
          this.sendChosenPeriod.emit({message: response1.message});
          return;
        }

        if(!this.chosenOne.check_in || !this.chosenOne.check_out) return;

        console.log("response1", response1);
        let dayPriceMap = new Map<Date, number>(Object.entries(response1).map(([key, value]) => [new Date(key), value as number]));
        console.log("dayPriceMap", dayPriceMap);
        
        for(let [a, b] of dayPriceMap) {
          a.setHours(this.check_out_time + 1, 0, 0, 0);
          if( ( a.getDate() == this.chosenOne.check_in?.getDate() && a.getMonth() == this.chosenOne.check_in?.getMonth() && a.getFullYear() == this.chosenOne.check_in?.getFullYear()) // check-in day
          || (this.chosenOne.check_in.getTime() < a.getTime() && a.getTime() < this.chosenOne.check_out.getTime())) { // day between check-in and check-out
            this.addToPriceInfo(b);
          }
        }
        this.chosenOne.price = this.chosenOne.price_info?.reduce((total, info) => total + info.price_per_night * info.nights, 0);
        this.sendBookingPeriod();
      }
    )
  }

  addToPriceInfo(b: number){
    let added = false;
    for(let info of this.chosenOne.price_info ?? []){
      if(info.price_per_night === b){
        info.nights++;
        added = true;
      }
    }
    if(!added) this.chosenOne.price_info?.push({nights: 1, price_per_night: b});
  }

  isSelectedOrBetween(day: number, monthName: string, year: number): boolean {
    if(!this.chosenOne || !this.chosenOne.check_in) return false;

    let currNumber: number = this.accommodationService.fetchDate(day, monthName, year);

    // current day is check-in day
    if(this.chosenOne.check_in?.getTime() - this.check_in_time*60*60*1000 == currNumber){
      return true;
    }

    // current day is not check-in and check-out hasn't been specified yet
    if(!this.chosenOne.check_out) return false;

    // current day is between check-in and check-out
    if(currNumber >= this.chosenOne.check_in.getTime() && currNumber <= this.chosenOne.check_out.getTime()) {
      return true;
    }
    else {
      return false;
    }
  }

  resetChoices() {
    this.chosenOne = {};
    this.alreadySelectedStart = false;

    this.sendBookingPeriod();
  }

  // Helper method to generate empty cells for the calendar grid
  getEmptyCells(firstDayIndex: number): number[] {
    return Array.from({ length: firstDayIndex }, (_, i) => i);
  }

}
