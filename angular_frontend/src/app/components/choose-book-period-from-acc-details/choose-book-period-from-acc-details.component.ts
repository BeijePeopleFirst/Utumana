import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  //TESTARE!!!!!
  //------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------------------

  //this.isAnAvailabilityCheck DA TOGLIERE SE POSSIBILE!!!!!!!!!!!


  //Template da correggere e provare:
  /*

<div *ngFor="let day of previousMonth.days"
     class="p-2 font-medium text-center rounded-md cursor-pointer w-9 bg-secondary-light text-neutral-1">
  
  <ng-container *ngIf="isAnAvailability(day, previousMonth.name, previousMonth.year) | async as available">
    
    <div *ngIf="!available" class="text-center">{{ day }}</div>
    
    <div *ngIf="!isSelectedOrBetween(day, previousMonth.name, previousMonth.year) && available"
         class="text-center bg-green-400 cursor-pointer"
         (click)="selectDay(day, 'previousMonth', previousMonth.name, previousMonth.year)">
      {{ day }}
    </div>

    <div *ngIf="isSelectedOrBetween(day, previousMonth.name, previousMonth.year)" 
         class="text-center cursor-pointer bg-green-950">
      {{ day }}
    </div>

  </ng-container>

</div>




ALTRI DUE TEMPLATE DA TESTARE:
PREVIOUS:

<div class="grid grid-cols-7 gap-2">
  <div *ngFor="let day of previousMonth.days" class="p-2 font-medium text-center rounded-md cursor-pointer w-9 bg-secondary-light text-neutral-1">
    
    <ng-container *ngIf="isAnAvailability(day, previousMonth.name, previousMonth.year) | async as available">
      
      <div *ngIf="!available" class="text-center">{{ day }}</div>
      
      <div *ngIf="!isSelectedOrBetween(day, previousMonth.name, previousMonth.year) && available"
           class="text-center bg-green-400 cursor-pointer"
           (click)="selectDay(day, 'previousMonth', previousMonth.name, previousMonth.year)">
        {{ day }}
      </div>

      <div *ngIf="isSelectedOrBetween(day, previousMonth.name, previousMonth.year)" 
           class="text-center cursor-pointer bg-green-950">
        {{ day }}
      </div>

    </ng-container>

  </div>
</div>



CURRENT MONTH:

<div class="w-64 p-4 border rounded-lg shadow-md bg-neutral-2 border-neutral-1">
  <h3 class="mb-3 text-lg font-bold text-center cursor-pointer text-primary-dark">
    {{ ("choose-book-period-from-acc-details." + currentMonth.name | translate) }} {{ currentMonth.year }}
  </h3>
  
  <div class="grid grid-cols-7 gap-2">
    <div *ngFor="let day of currentMonth.days" class="p-2 font-medium text-center rounded-md w-9 bg-primary-light text-neutral-1">
      
      <ng-container *ngIf="isAnAvailability(day, currentMonth.name, currentMonth.year) | async as available">
        
        <div *ngIf="!available" class="text-center">{{ day }}</div>
        
        <div *ngIf="!isSelectedOrBetween(day, currentMonth.name, currentMonth.year) && available"
             class="text-center bg-green-400 cursor-pointer"
             (click)="selectDay(day, 'currentMonth', currentMonth.name, currentMonth.year)">
          {{ day }}
        </div>

        <div *ngIf="isSelectedOrBetween(day, currentMonth.name, currentMonth.year)" 
             class="text-center cursor-pointer bg-green-950">
          {{ day }}
        </div>

      </ng-container>

    </div>
  </div>

</div>


  */


  private availabilityCache = new Map<string, BehaviorSubject<boolean>>();

isAnAvailability(day: number, month: string, year: number): Observable<boolean> {
    let key = `${day}-${month}-${year}`;

    // Se il valore è già in cache, restituiscilo subito
    if (this.availabilityCache.has(key)) {
        return this.availabilityCache.get(key)!.asObservable();
    }

    // Altrimenti, crea un nuovo BehaviorSubject con valore predefinito false
    const subject = new BehaviorSubject<boolean>(false);
    this.availabilityCache.set(key, subject);

    let toCompare = this.accommodationService.fetchDate(day, month, year);

    this.accommodationService.getAvailabilities(this.accommodation).pipe(
        map(data => {
            if ("message" in data) {
                this.sendChosenAvailability.emit({ message: data.message });
                return false;
            }

            for (let a of data) {
                let startDate = Date.parse(a.start_date);
                let endDate = Date.parse(a.end_date);

                if (toCompare === startDate || toCompare === endDate || (toCompare > startDate && toCompare < endDate)) {
                    return true;
                }
            }
            return false;
        }),
        tap(result => {
            subject.next(result); // Aggiorna il valore nel BehaviorSubject
        })
    ).subscribe();

    return subject.asObservable();
}

  /*isAnAvailability(day: number, month: string, year: number): Observable<boolean> {
    let toCompare = this.accommodationService.fetchDate(day, month, year);

    return this.accommodationService.getAvailabilities(this.accommodation).pipe(
      map(data => {
        if("message" in data) {
          this.sendChosenAvailability.emit({message: data.message});
          this.isAnAvailabilityCheck = false;
          return false;
        }
        else {
          for(let a of data) {
            if(toCompare === Date.parse(a.start_date)
              || toCompare === Date.parse(a.end_date)) {
            
                this.isAnAvailabilityCheck = true;
                return true;
            }
            else if(toCompare > Date.parse(a.start_date)
                    && toCompare < Date.parse(a.end_date)) {
                  
                
                this.isAnAvailabilityCheck = true;
                return true;
            }
            else {
              this.isAnAvailabilityCheck = false;
              return false;
            }
          }
          this.isAnAvailabilityCheck = false;
          return false;
        }
      })
    )
  }*/
 //------------------------------------------------------------------------------------------------------------------
 //------------------------------------------------------------------------------------------------------------------
 //------------------------------------------------------------------------------------------------------------------

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
