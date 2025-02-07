import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  chosenOne: Availability = new Availability();

  currentMonth!: { name: string; days: number[]; monthIndex: number; year: number };
  previousMonth!: { name: string; days: number[]; monthIndex: number; year: number };

  alreadySelectedStart: boolean = false;

  isAnAvailabilityCheck: boolean = false;


  constructor(
    private accommodationService: AccommodationService
  )
  {}

  sendAvailability() {
    if(!this.chosenOne) return;
    this.sendChosenAvailability.emit({start_date: this.chosenOne.start_date, end_date: this.chosenOne.end_date, price_per_night: this.chosenOne.price_per_night, accommodation_id: this.chosenOne.accommodation_id});
  }

  ngOnInit() {
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

    this.accommodationService.getAvailabilities(this.accommodation).subscribe(
      response1 => {
        if("message" in response1) {
          this.sendChosenAvailability.emit({message: response1.message});
          return;
        }
        else {
          let date = this.accommodationService.fetchDate(day, monthName, year);

          for(let a of response1) {
            if(date >= Date.parse(a.start_date) && date <= Date.parse(a.end_date)) {
              this.chosenOne.price_per_night = a.price_per_night;
              break;
            }
          }

          if(!this.alreadySelectedStart) {
            this.alreadySelectedStart = true;
            this.chosenOne.start_date = new Date(this.accommodationService.fetchDate(day, monthName, year)) + "";
            console.log(this.chosenOne.start_date);
          }
          else {
            if(Date.parse(this.chosenOne.start_date) >= this.accommodationService.fetchDate(day, monthName, year)) {
              this.sendChosenAvailability.emit({message: "Start Date must be AFTER End Date"});
              return;
            }
            this.chosenOne.end_date = new Date(this.accommodationService.fetchDate(day, monthName, year)) + "";
            console.log(this.chosenOne.end_date);
            this.sendAvailability();
          }
        }
      }
    )

    //AL RESET AZZERO CAMPI NEL PADRE
    
    
  }

  isAnAvailability(day: number, month: string, year: number): Observable<boolean> {
    let toCompare = this.accommodationService.fetchDate(day, month, year);

    return this.accommodationService.getAvailabilities(this.accommodation).pipe(
      map(data => {
        if("message" in data) {
          this.sendChosenAvailability.emit({message: data.message});
          return false;
        }
        else {
          for(let a of data) {
            if(this.accommodationService.fetchDate(day, month, year) === Date.parse(a.start_date)
              || this.accommodationService.fetchDate(day, month, year) === Date.parse(a.end_date)) {
            
                return true;
            }
            else if(this.accommodationService.fetchDate(day, month, year) > Date.parse(a.start_date)
                    && this.accommodationService.fetchDate(day, month, year) < Date.parse(a.end_date)) {
                  
                return true;
            }
            else return false;
          }

          return false;
        }
      })
    )
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
    this.chosenOne.start_date = "1970/01/01";
    this.chosenOne.end_date = "1970/01/02";
    this.alreadySelectedStart = false;

    this.sendAvailability();
  }

}
