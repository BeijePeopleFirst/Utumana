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

  @Input() checkInList!: string[];
  @Input() checkOutList!: string[];
  currentList: string[] = [];
  
  chosenOne: PartialBooking = {};

  currentMonth!: { name: string; days: number[]; monthIndex: number; year: number; firstDayIndex: number };
  previousMonth!: { name: string; days: number[]; monthIndex: number; year: number; firstDayIndex: number };
  today = new Date();

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

    if(this.queryParamsFromParent && this.queryParamsFromParent["start_date"] && this.queryParamsFromParent["end_date"]) {
      let tmp1: Date = new Date(this.queryParamsFromParent["start_date"]);
      let tmp2: Date = new Date(this.queryParamsFromParent["end_date"]);
      tmp1.setHours(0, 0, 0, 0);
      tmp2.setHours(0, 0, 0, 0);

      this.chosenOne.check_in = tmp1;
      this.chosenOne.check_out = tmp2;

      this.selectDay(tmp1.getDate(), this.getMonthNameFromMonthIndex(tmp1.getMonth()), tmp1.getFullYear());
      this.selectDay(tmp2.getDate(), this.getMonthNameFromMonthIndex(tmp2.getMonth()), tmp2.getFullYear());
      
    }
    else this.currentList = this.checkInList;

    console.log("currentList", this.currentList);
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

  getDataInfo(day: number, month: string, year: number): number {
    return new Date(this.accommodationService.fetchDate(day, month, year)).getTime() + 86400000;
  }

  getDate(day: number, month: string, year: number): Date {
    return new Date(this.accommodationService.fetchDate(day, month, year));
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

  private checkInDate: string = "";
  isCheckOutSelected: boolean = false;
  selectDay(day: number, monthName: string, year: number) {
    this.chosenOne.accommodation = this.accommodation;

    if(this.chosenOne.check_in != null && this.chosenOne.check_out != null) {
      this.alreadySelectedStart = false;
      this.chosenOne.check_in = undefined;
      this.chosenOne.check_out = undefined;
    }

    if(!this.alreadySelectedStart) {
      this.chosenOne.check_in = new Date(this.accommodationService.fetchDate(day, monthName, year));
      this.checkInDate = year + "-" + monthName + "-" + day;

      let stringTest: string = this.getStringFromInputParams(day, monthName, year);

      let lastIndex: number = this.getFirstNotLecitCheckOutDate(this.checkOutList, this.chosenOne.check_in);

      //this.currentList = this.checkOutList.slice(this.checkInList.indexOf(stringTest)-1, latestIndex);

      let indexStringTest: number = this.checkInList.indexOf(stringTest);

      if(indexStringTest !== 0 && this.checkOutList.includes(stringTest)) {
        this.currentList = this.checkOutList.slice(this.checkInList.indexOf(stringTest)+1, lastIndex);
      }
      else {
        //this.currentList = this.checkOutList.slice(this.checkInList.indexOf(stringTest), lastIndex);
        let indexFinal: number = this.getFirstNextDayComparedToSelectedCheckIn(stringTest, this.checkOutList);
        this.currentList = this.checkOutList.slice(indexFinal, lastIndex);
      }

      console.log("currentList: " + this.currentList);

    }
    else {
      if(this.chosenOne.check_in!.getTime() >= this.accommodationService.fetchDate(day, monthName, year)) {
        if(this.translateService.currentLang === 'en-US') this.sendChosenPeriod.emit({message: "Start Date must be BEFORE End Date"});
        if(this.translateService.currentLang === 'it-IT') this.sendChosenPeriod.emit({message: "La data di inizio deve essere precedente alla data di fine"});
        return;
      }
      this.chosenOne.check_out = new Date(this.accommodationService.fetchDate(day, monthName, year));
      this.isCheckOutSelected = true;
      this.currentList = this.generateSelectedPeriodOfDates(this.chosenOne.check_in!, this.chosenOne.check_out);
      this.sendChosenPeriod.emit(this.chosenOne);
    }

    if(!this.alreadySelectedStart) {
      this.chosenOne.check_in = new Date(this.accommodationService.fetchDate(day, monthName, year) + this.check_in_time*60*60*1000);
      this.alreadySelectedStart = true;
      
      // this.accommodationService.getAvailabilities(this.accommodation).subscribe(
      //   response1 => {
      //     if("message" in response1) {
      //       this.sendChosenPeriod.emit({message: response1.message});
      //       return;
      //     }
      //     else {
      //       let date = this.accommodationService.fetchDate(day, monthName, year);
      //       let support: Date = new Date(date);
      //       let res2 = new Map<Date, number>(Object.entries(response1).map(([key, value]) => [new Date(key), value as number]));
            
      //       for(let [a, b] of res2) {
      //         if((a.setHours(0, 0, 0, 0)) == support.setHours(0, 0, 0, 0)) {
                
      //           this.chosenOne.price_per_night = b;
      //           console.log("Stampo valore impostato -> ", this.chosenOne.price_per_night);
      //           break;
      //         }
      //       }
      //     }
      //   }
      // )
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

  private getFirstNextDayComparedToSelectedCheckIn(s: string, checkOuts: string[]): number {

    let d: Date = this.getDateFromDateString(s);

    for(let i = 0; i < checkOuts.length; i++) {
      if(this.getDateFromDateString(checkOuts[i]).getTime() > d.getTime()) return i;
    }

    return -1;
  }

  private getFirstNotLecitCheckOutDate(list: string[], chkInDate: Date): number {
    let tmp1: Date;
    let tmp2: Date;

    for(let i = 0; i < list.length - 1; i++) {

      if(this.getDateFromDateString(list[i]).getTime() <= chkInDate.getTime()) continue;

      tmp1 = this.getDateFromDateString(list[i]);
      tmp2 = this.getDateFromDateString(list[i+1]);

      const timeDiff = Math.abs(tmp2.getTime() - tmp1.getTime());
      const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
      
      // If dates are not consecutive (1 day apart), we found our boundary
      if(diffDays !== 1) return i+1;
    }

    return list.length;
  }

  //Parses dd-Month-yyyy:
  private getDateFromDateString(s: string): Date {
    let tokens: string[] = s.split("-");
    let day: number = Number(tokens[0]);
    let month: number = this.getMonthIndexFromName(tokens[1]);
    let year: number = Number(tokens[2]);

    let res: Date = new Date(year, month, day);

    return res;
  }

  private getMonthIndexFromName(s: string): number {
    switch(s) {
      case "January": return 0;
      case "February": return 1;
      case "March": return 2;
      case "April": return 3;
      case "May": return 4;
      case "June": return 5;
      case "July": return 6;
      case "August": return 7;
      case "September": return 8;
      case "October": return 9;
      case "November": return 10;
      case "December": return 11;
      default: return -1;
    }
  }

  private generateSelectedPeriodOfDates(tmp: Date, chkOut: Date): string[] {
    let resultSupport: string[] = [];

    let day: number;
    let month: number;
    let year: number;

    while(tmp.getTime() <= chkOut.getTime()) {
      resultSupport.push(this.generateStringFromDate(tmp));
      
      day = tmp.getDate();
      month = tmp.getMonth();
      year = tmp.getFullYear();

      tmp = new Date(year, month, day+1);
    }

    return resultSupport;
  }

  private generateStringFromDate(d: Date): string {
    let day: number = d.getDate();
    let month: number = d.getMonth();
    let year: number = d.getFullYear();

    let monthName: string = this.getMonthNameFromMonthIndex(month);

    return (day < 10 ? "0" + day : day) + "-" + monthName + "-" + year;
  }

  private getMonthNameFromMonthIndex(index: number): string {

    switch(index) {

      case 0: return "January";
      case 1: return "February";
      case 2: return "March";
      case 3: return "April";
      case 4: return "May";
      case 5: return "June";
      case 6: return "July";
      case 7: return "August";
      case 8: return "September";
      case 9: return "October";
      case 10: return "November";
      case 11: return "December";
      default: return "Error";
      
    }
  }

  private getStringFromInputParams(day: number, monthName: string, year: number): string {
    return "" + (day < 10? "0"+day : day) + "-" + monthName + "-" + year;
  }

  toCompatibleStringFormat(s: string): string {
    if(s.includes("/")) {
      let tmp: string[] = s.split("/");
      return tmp[2] + "-" + tmp[1] + "-" + tmp[0];
    }
    else if(s.includes("T")) return s.split("T")[0];
    else return s;
  }

  getDateNumberValue(d: Date): number {
    return d.setHours(0,0,0,0);
  }

  isSelectedOrBetween(day: number, monthName: string, year: number): boolean {
    if(!this.chosenOne || !this.chosenOne.check_in) return false;

    /*let currDate: Date = new Date(this.accommodationService.fetchDate(day, monthName, year));
    currDate.setHours(0,0,0,0);
    let currNumber: number = currDate.getTime();*/

    let currNumber: number = this.getDateNumberValue(new Date(this.accommodationService.fetchDate(day, monthName, year)));

    let outNumber: number = -1;
    if(this.chosenOne.check_out != null) outNumber = this.getDateNumberValue(this.chosenOne.check_out);
    
    let inNumber: number = -1;
    if(this.chosenOne.check_in != null) inNumber = this.getDateNumberValue(this.chosenOne.check_in);
    
    if(!this.chosenOne || this.chosenOne.check_in == null) return false;

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

  isNotCheckInorCheckOut(day: number, monthName: string, year: number): boolean {
    let isNotCheckIn: boolean = true;
    if(this.chosenOne.check_in && this.chosenOne.check_in.getTime() == new Date(this.accommodationService.fetchDate(day, monthName, year)).getTime()) {
      isNotCheckIn = false;
      console.log("check-in: " + this.chosenOne.check_in + " check-out: " + this.chosenOne.check_out);
    }
    let isNotCheckOut: boolean = true;
    if(this.chosenOne.check_out && this.chosenOne.check_out.getTime() == new Date(this.accommodationService.fetchDate(day, monthName, year)).getTime()) {
      isNotCheckOut = false;
    }
    return isNotCheckIn && isNotCheckOut;
  }

  resetChoices() {
    this.chosenOne = {};
    this.alreadySelectedStart = false;
    this.isCheckOutSelected = false;
    this.checkInDate = "";
    this.currentList = this.checkInList;

    this.sendBookingPeriod();
  }

  // Helper method to generate empty cells for the calendar grid
  getEmptyCells(firstDayIndex: number): number[] {
    return Array.from({ length: firstDayIndex }, (_, i) => i);
  }

}
