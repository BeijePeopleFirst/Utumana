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
  @Output() sendChosenAvailability = new EventEmitter<{ start_date: string, end_date: string, price_per_night: number, accommodation_id: number } | {message: string}>();

  @Input() queryParamsFromParent?: Params;

  @Input() unavailabilities!: string[];

  chosenOne: Availability = new Availability();

  currentMonth!: { name: string; days: number[]; monthIndex: number; year: number };
  previousMonth!: { name: string; days: number[]; monthIndex: number; year: number };

  alreadySelectedStart: boolean = false;

  availabilityCacheImproved: Map<string, boolean> = new Map<string, boolean>();
  selectedDays: Map<string, boolean> = new Map<string, boolean>();


  constructor(
    private accommodationService: AccommodationService,
    private translateService: TranslateService
  )
  {}

  sendAvailability() {
    if(!this.chosenOne) return;
    console.log("Stampo valore inviato -> ", this.chosenOne.price_per_night);
    this.sendChosenAvailability.emit({start_date: this.chosenOne.start_date, end_date: this.chosenOne.end_date, price_per_night: this.chosenOne.price_per_night, accommodation_id: this.chosenOne.accommodation_id});
  }

  ngOnInit() {
    
    this.initializeAvailabilityCache();

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

  selectDay(day: number, month: string, monthName: string, year: number) {
    this.chosenOne.accommodation_id = this.accommodation.id!;

    if(!this.alreadySelectedStart) {
      this.chosenOne.start_date = new Date(this.accommodationService.fetchDate(day, monthName, year)) + "";
      //this.selectedDays.set(day + '-' + month + '-' + year, true);
      console.log(this.chosenOne.start_date);
    }
    else {
      if(Date.parse(this.chosenOne.start_date) >= this.accommodationService.fetchDate(day, monthName, year)) {
        if(this.translateService.currentLang === 'en-US') this.sendChosenAvailability.emit({message: "Start Date must be BEFORE End Date"});
        if(this.translateService.currentLang === 'it-IT') this.sendChosenAvailability.emit({message: "La data di inizio deve essere precedente alla data di fine"});
        return;
      }
      this.chosenOne.end_date = new Date(this.accommodationService.fetchDate(day, monthName, year)) + "";
      console.log(this.chosenOne.end_date);
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
            
            for(let a of response1) {
              if(date >= (new Date(a.start_date).setHours(0, 0, 0, 0)) && date <= (new Date(a.end_date).setHours(0, 0, 0, 0))) {
                console.log("Entro in IF");
                this.chosenOne.price_per_night = a.price_per_night;
                console.log("Stampo valore impostato -> ", this.chosenOne.price_per_night);
                break;
              }
            }

          }
        }
      )
    }
    
  }

  //TODO: Remove dates that are in common with UNAVAILABILITIES
  initializeAvailabilityCache(): void {
    this.accommodationService.getAvailabilities(this.accommodation).subscribe(
      availabilities => {
        if("message" in availabilities) {
          this.sendChosenAvailability.emit({message: availabilities.message});
          return;
        }
        else {

          let start: number;
          let end: number;

          let s_day: number;        //From 1
          let s_month: string;      //January, February...
          let s_year: number;       //2025, 2026...

          let e_day: number;        //From 1
          let e_month: string;      //January, February...
          let e_year: number;       //2025, 2026...



          //1-January-2025          

          for(let a of availabilities) {
            start = Date.parse(a.start_date);
            end = Date.parse(a.end_date);

            s_month = this.getMonthName(new Date(start).getMonth());
            s_day = new Date(start).getDate();
            s_year = new Date(start).getFullYear();

            //Now I have the start date:
            this.availabilityCacheImproved.set(s_day + '-' + s_month + '-' + s_year, true);

            e_month = this.getMonthName(new Date(end).getMonth());
            e_day = new Date(end).getDate();
            e_year = new Date(end).getFullYear();

            //Now I have the end date:
            this.availabilityCacheImproved.set(e_day + '-' + e_month + '-' + e_year, true);
            
            let tmp = new Date(s_year, new Date(start).getMonth(), s_day + 1);

            while(tmp.getTime() < new Date(end).getTime()) {
              //Aggiungo alla mappa:
              this.availabilityCacheImproved.set(tmp.getDate() + '-' + this.getMonthName(tmp.getMonth()) + '-' + tmp.getFullYear(), true);

              //Incremento di un Giorno:
              tmp = new Date(tmp.getFullYear(), new Date(tmp).getMonth(), tmp.getDate() + 1);
            }
          }

          //Now lets remove the days that are in comon with unavailabilities array:
          let support: Map<string, boolean> = new Map<string, boolean>();
          this.availabilityCacheImproved.forEach((a, b) => support.set(b, a));
          //console.log("Stampo il nuovo Map copiato -> ", support, "Stampo il vecchio -> ", this.availabilityCacheImproved);

          let toAnalize: string;
          let arrStr: string[];
          let monthNameToSet: String = "";
          for(let u of this.unavailabilities) {
            arrStr = u.split("-"); //yyyy-MM-dd
            monthNameToSet = "";

            //Inside unavailabilities the month names are all in lowercase characters: I need to convert the first character into uppercase
            for(let index = 0; index < arrStr[1].length; index++)
              if(index === 0) monthNameToSet += arrStr[1][index].toUpperCase();
              else monthNameToSet += arrStr[1][index];

            toAnalize = arrStr[2] + "-" + monthNameToSet + "-" + arrStr[0];

            if(support.has(toAnalize)) this.availabilityCacheImproved.delete(toAnalize);
          }
              

          //console.log("Stamp unavailabilities -> ", this.unavailabilities);
          //console.log("Stampo il map risultante -> ", this.availabilityCacheImproved);
        }
      }
    )
  }

  private getMonthName(m: number): string {
    let month = "";

    switch (m) {
      case 0:
        month = "January";
        break;

      case 1:
        month = "February";
        break;

      case 2:
        month = "March";
        break;

      case 3:
        month = "April";
        break;

      case 4:
        month = "May";
        break;

      case 5:
        month = "June";
        break;

      case 6:
        month = "July";
        break;

      case 7:
        month = "August";
        break;

      case 8:
        month = "September";
        break;

      case 9:
        month = "October";
        break;

      case 10:
        month = "November";
        break;

      case 11:
        month = "December";
        break;
    }

    return month;
  }

  isSelectedOrBetween(day: number, monthName: string, year: number): boolean {
    if(this.accommodationService.fetchDate(day, monthName, year) === Date.parse(this.chosenOne.start_date)
      || this.accommodationService.fetchDate(day, monthName, year) === Date.parse(this.chosenOne.end_date)) {
    
        return true;
    }
    else if(this.accommodationService.fetchDate(day, monthName, year) > Date.parse(this.chosenOne.start_date)
            && this.accommodationService.fetchDate(day, monthName, year) < Date.parse(this.chosenOne.end_date)) {
          
        return true;
    }
    else return false;
  }

  resetChoices() {
    this.chosenOne = new Availability();
    this.chosenOne.accommodation_id = this.accommodation.id!;
    this.chosenOne.price_per_night = 0;
    this.chosenOne.start_date = "";
    this.chosenOne.end_date = "";
    this.alreadySelectedStart = false;

    this.sendAvailability();
  }

}
