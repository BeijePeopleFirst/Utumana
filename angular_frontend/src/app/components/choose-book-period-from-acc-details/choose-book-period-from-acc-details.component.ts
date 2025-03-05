import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
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
  @Output() sendChosenAvailability = new EventEmitter<Availability | {message: string}>();

  @Input() queryParamsFromParent?: Params;

  @Input() availabilities!: string[];

  chosenOne: Availability = {start_date: "", end_date: "", price_per_night: 0};

  currentMonth!: { name: string; days: number[]; monthIndex: number; year: number };
  previousMonth!: { name: string; days: number[]; monthIndex: number; year: number };

  alreadySelectedStart: boolean = false;

  //availabilityCacheImproved: Map<string, boolean> = new Map<string, boolean>();
  selectedDays: Map<string, boolean> = new Map<string, boolean>();


  constructor(
    private accommodationService: AccommodationService,
    private translateService: TranslateService
  )
  {}

  sendAvailability() {
    if(!this.chosenOne) return;
    console.log("Stampo valore inviato -> ", this.chosenOne.price_per_night);
    this.sendChosenAvailability.emit(this.chosenOne);
  }

  ngOnInit() {

    if(this.queryParamsFromParent && this.queryParamsFromParent["start_date"] && this.queryParamsFromParent["end_date"]) {
      let tmp1: Date = new Date(this.queryParamsFromParent["start_date"]);
      let tmp2: Date = new Date(this.queryParamsFromParent["end_date"]);
      tmp1.setHours(0, 0, 0, 0);
      tmp2.setHours(0, 0, 0, 0);

      this.chosenOne.start_date = tmp1 + "";
      this.chosenOne.end_date = tmp2 + "";
    }

    this.initializeCalendars(new Date().getFullYear(), new Date().getMonth());
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
    return {
      name: monthNames[month],
      days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      monthIndex: month,
      year: year
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

  private checkInDate: string = "";
  selectDay(day: number, month: string, monthName: string, year: number) {
    this.chosenOne.accommodation_id = this.accommodation.id!;

    if(this.chosenOne.start_date != "" && this.chosenOne.end_date != "") {
      this.alreadySelectedStart = false;
      this.chosenOne.start_date = "";
      this.chosenOne.end_date = "";
    }

    if(!this.alreadySelectedStart) {
      this.chosenOne.start_date = new Date(this.accommodationService.fetchDate(day, monthName, year)) + "";
      //this.selectedDays.set(day + '-' + month + '-' + year, true);
      console.log(this.chosenOne.start_date);
      this.checkInDate = year + "-" + monthName + "-" + day;
    }
    else {
      if(Date.parse(this.chosenOne.start_date.split("T")[0]) >= this.accommodationService.fetchDate(day, monthName, year)) {
        if(this.translateService.currentLang === 'en-US') this.sendChosenAvailability.emit({message: "Start Date must be BEFORE End Date"});
        if(this.translateService.currentLang === 'it-IT') this.sendChosenAvailability.emit({message: "La data di inizio deve essere precedente alla data di fine"});
        return;
      }
      this.chosenOne.end_date = new Date(this.accommodationService.fetchDate(day, monthName, year)) + "";
      console.log("FINAL VALUES -> " + this.chosenOne.start_date, this.chosenOne.end_date);
      this.sendAvailability();
    }

    if(!this.alreadySelectedStart) {
      this.alreadySelectedStart = true;
      
      this.accommodationService.getAvailabilities(this.accommodation).subscribe(
        response1 => {
          if("message" in response1) {
            this.sendChosenAvailability.emit({message: response1.message});
            return;
          }
          else {
            let date = this.accommodationService.fetchDate(day, monthName, year);
            let support: Date = new Date(date);
            let res2 = new Map<Date, number>(Object.entries(response1).map(([key, value]) => [new Date(key), value as number]));
            //console.log(res2);
            
            for(let [a, b] of res2) {
              if((a.setHours(0, 0, 0, 0)) == support.setHours(0, 0, 0, 0)) {
                console.log("Entro in IF");
                this.chosenOne.price_per_night = b;
                console.log("Stampo valore impostato -> ", this.chosenOne.price_per_night);
                break;
              }
            }

          }
        }
      )
    }
    
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

    let sup: string = year + "-" + monthName + "-" + day;
    if(sup === this.checkInDate) return true;

    /*let currDate: Date = new Date(this.accommodationService.fetchDate(day, monthName, year));
    currDate.setHours(0,0,0,0);
    let currNumber: number = currDate.getTime();*/

    let currNumber: number = this.getDateNumberValue(new Date(this.accommodationService.fetchDate(day, monthName, year)));

    let outNumber: number = -1;
    if(this.chosenOne.end_date != "") {
      outNumber = this.getDateNumberValue(new Date(Date.parse(this.toCompatibleStringFormat(this.chosenOne.end_date))));
    }
    
    let inNumber: number = -1;
    if(this.chosenOne.start_date != "") {
      inNumber = this.getDateNumberValue(new Date(Date.parse(this.toCompatibleStringFormat(this.chosenOne.start_date))));
    }
    
    if(!this.chosenOne || this.chosenOne.start_date == "") return false;

    if(currNumber === inNumber || currNumber === outNumber) {
    
        return true;
    }
    else if(currNumber >= inNumber && this.chosenOne.end_date !== "" && currNumber <= outNumber) {
        return true;
    }
    else {
      return false;
    }
  }

  resetChoices() {
    this.chosenOne = {
      accommodation_id: this.accommodation.id,
      price_per_night: 0,
      start_date: "",
      end_date: "",
    };
    this.alreadySelectedStart = false;
    this.checkInDate = "";

    this.sendAvailability();
  }

}
