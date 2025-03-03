import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { USE_DEFAULT_LANG } from '@ngx-translate/core';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { BookingDTO } from 'src/app/dtos/bookingDTO';
import { Accommodation } from 'src/app/models/accommodation';
import { Availability } from 'src/app/models/availability';
import { Booking } from 'src/app/models/booking';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { BookingService } from 'src/app/services/booking.service';
import { BookingStatus } from 'src/app/utils/enums';

@Component({
  selector: 'app-book-now',
  templateUrl: './book-now.component.html',
  styleUrls: ['./book-now.component.css']
})
export class BookNowComponent implements OnInit {

  //Accommodation variables:
  //------------------------------------------------------------------------------------------------
  accommodation!: Accommodation;
  isMe!: boolean;
  availabilitiesFinal: string[] = [];
  //------------------------------------------------------------------------------------------------

  //Chosen dates:
  //------------------------------------------------------------------------------------------------
  selectedCheckIn?: number;
  selectedCheckOut?: number;
  //------------------------------------------------------------------------------------------------

  //Messagges:
  //------------------------------------------------------------------------------------------------
  thereAreMessagesToDiplay: boolean = false;
  backendMsg?: string;
  invalidAccommodationError: boolean = false;
  noAccommodationIdWasProvidedError: boolean = false;
  errorOccurredWhileFetchingMonthNameOrIndexError: boolean = false;
  invalidChosenDayError: boolean = false;
  completedBooking: boolean = false;
  errorInBookingProcedure: boolean = false;
  completedUnavailabilitySettingMessage: boolean = false;
  userNotLoggedError: boolean = false;
  accommodationInfoError: boolean = false;
  //------------------------------------------------------------------------------------------------

  // Data corrente per il calendario principale
  currentDate: Date = new Date();

  // Matrici per i due calendari (array di settimane, ogni settimana è un array di 7 giorni)
  calendarLeft: (number | null)[][] = [];
  calendarRight: (number | null)[][] = [];


  constructor(
    private accommodationService: AccommodationService,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router
  )
  {}

  ngOnInit(): void {
    //this.generateCalendars();

    if(!this.route.snapshot.params["id"]) {
      this.thereAreMessagesToDiplay = true;
      this.noAccommodationIdWasProvidedError = true;
      return;
    }

    let accId: number = Number(this.route.snapshot.params["id"]);

    this.accommodationService.getAccommodationById(accId).subscribe(
      acc => {
        if(!acc) {
          console.error("No Accommodation was found");
          this.thereAreMessagesToDiplay = true;
          this.noAccommodationIdWasProvidedError = true;
          return;
        }

        this.accommodation = acc;

        //Now lets check if the current logged User is an Admin or the owner of the accommodation:
        this.accommodationService.getAccommodationInfo(this.accommodation.id!).subscribe(
          responseInfo => {
            if("message" in responseInfo) {
              this.thereAreMessagesToDiplay = true;
              this.backendMsg = responseInfo.message;
              return;
            }

            let responseInfo2 = responseInfo as any;console.log("STAMPO il 2 ----> ", responseInfo2);
            if(responseInfo2["isAdmin"] == null || responseInfo2["isOwner"] == null
              || responseInfo2["availabilities_post_elaboration"] == null
            ) {
              this.thereAreMessagesToDiplay = true;console.log("ECComi QUI1");
              this.accommodationInfoError = true;
              return;
            }
            
            this.isMe = Boolean(responseInfo2["isOwner"]).valueOf();

            let tmpAv: any = responseInfo2["availabilities_post_elaboration"];

            if(!Array.isArray(tmpAv)) {
              this.thereAreMessagesToDiplay = true;console.log("ECComi QUI2");
              this.accommodationInfoError = true;
              return;
            }
            else {
              for(let a of tmpAv)
                this.availabilitiesFinal.push(a);
            }

            this.generateCalendars();
          }
        )
        
      }
    )
  }

  public fetchDayString(d: number | null): string {
    if(!d) return "Null Value";
    return d < 10 ? ("0" + d) : ("" + d);
  }

  // Getter per il nome del mese corrente (es. "marzo")
  public getMonthName(monthIndexLocal?: number): string {
    let monthIndex: number = monthIndexLocal ? monthIndexLocal : this.currentDate.getMonth();

    switch(monthIndex) {
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

  // Getter per l'anno corrente
  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  get nextMonthYear(): number {
    if(this.currentDate.getMonth() === 11) return this.currentYear + 1;
    else return this.currentYear;
  }

  // Passa al mese precedente e rigenera i calendari
  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendars();
  }

  // Passa al mese successivo e rigenera i calendari
  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendars();
  }

  // Genera i calendari per il mese corrente e per il mese successivo
  generateCalendars(): void {
    this.calendarLeft = this.generateCalendar(this.currentDate);
    const nextMonthDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.calendarRight = this.generateCalendar(nextMonthDate);
  }

  // Metodo che genera una matrice di settimane per il mese passato come parametro.
  // Ogni settimana è un array di 7 elementi (da domenica a sabato) e i giorni non validi sono null.
  generateCalendar(date: Date): (number | null)[][] {
    const weeks: (number | null)[][] = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const totalDays = new Date(year, month + 1, 0).getDate();
    let week: (number | null)[] = new Array(7).fill(null);

    // Riempie la prima settimana a partire dal giorno della settimana del 1° del mese
    const startDayIndex = firstDay.getDay(); // 0 = Domenica, 6 = Sabato
    let day = 1;
    for (let i = startDayIndex; i < 7 && day <= totalDays; i++) {
      week[i] = day;
      day++;
    }
    weeks.push(week);

    // Compila le settimane successive
    while (day <= totalDays) {
      week = new Array(7).fill(null);
      for (let i = 0; i < 7 && day <= totalDays; i++) {
        week[i] = day;
        day++;
      }
      weeks.push(week);
    }
    return weeks;
  }

// Metodo per ottenere il nome del mese successivo
public getNextMonthName(): string {
  
  if(this.currentDate.getMonth() === 11) return "January";

  const nextMonthDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
  //console.log(this.getMonthName(nextMonthDate.getMonth()));
  return this.getMonthName(nextMonthDate.getMonth());
}

resetSelectedDates() {
  this.selectedCheckIn = undefined;
  this.selectedCheckOut = undefined;
}

isSelected(year: number, monthName: string, day: number | null): boolean {

  if(!day || !this.selectedCheckIn) return false;

  let test: number = new Date(year, this.getMonthNumberByName(monthName), day).getTime()
  if(test === this.selectedCheckIn || test === this.selectedCheckOut) return true;

  return this.checkIfIsBetween(test, this.selectedCheckIn!, this.selectedCheckOut!);
}

nextMonthName(): string {
  if(this.getMonthName() === "December") return "January";
  else {
    let number: number = this.currentDate.getMonth() + 1;
    return this.getMonthName(number);
  }
}

selectDay(y: number, monthName: string, day: number | null): void {
  if(!day) {
    this.invalidChosenDayError = true;
    this.thereAreMessagesToDiplay = true;
    return;
  }

  let chosenDate: number = new Date(y, this.getMonthNumberByName(monthName), day).getTime();

  if(!this.selectedCheckIn) this.selectedCheckIn = chosenDate;
  else {
    this.selectedCheckOut = chosenDate;
    console.log(new Date(this.selectedCheckIn!), new Date(this.selectedCheckOut!));
  }
}

isAnUnavailability: boolean = false;
confirmSelectedDates(): void {

  if(!localStorage.getItem("id")) {
    this.thereAreMessagesToDiplay = true;
    this.userNotLoggedError = true;
    return;
  }

  let userId: number = Number(localStorage.getItem("id"));

  let selectedCheckInStr: string = this.convertToCompatibleDateFormat(new Date(this.selectedCheckIn!).toLocaleDateString());
  let selectedCheckOutStr: string = this.convertToCompatibleDateFormat(new Date(this.selectedCheckOut!).toLocaleDateString());
  
  //Unavailability:
  if(this.isAnUnavailability) {
    let unavailability: Availability = new Availability();
    unavailability.accommodation_id = this.accommodation.id!;
    unavailability.start_date = selectedCheckInStr;
    unavailability.end_date = selectedCheckOutStr;
    unavailability.price_per_night = 0;

    //Now lets store the Unavailability:
    this.bookingService.newUnavailability(unavailability).subscribe(
      response => {
        if("message" in response) {
          this.thereAreMessagesToDiplay = true;
          this.errorInBookingProcedure = true;
          this.backendMsg = response.message;
          return;
        }

        this.completedUnavailabilitySettingMessage = true;
        this.thereAreMessagesToDiplay = true;

        setTimeout(() => this.goToHomepage(), 3200);
      }
    )
  }

  //Real Booking:
  else {
    let booking: Booking = new Booking(this.accommodation, this.convertToCompatibleDateFormat(new Date(Date.now()).toLocaleDateString()), 0, 
                                          BookingStatus.PENDING, selectedCheckInStr, selectedCheckOutStr, false, userId);

    //Now lets store the Booking:
    this.bookingService.newBooking(booking).subscribe(
      response => {
        if("message" in response) {
          this.errorInBookingProcedure = true;
          this.thereAreMessagesToDiplay = true;
          this.backendMsg = response.message;
          return;
        }

        this.completedBooking = true;
        this.thereAreMessagesToDiplay = true;

        setTimeout(() => this.goToHomepage(), 3200);
      }
    )
  }

}

private goToHomepage(): void {
  this.router.navigate(["/"]);
}

//From dd/MM/yyyy TO yyyy/MM/dd:
private convertToCompatibleDateFormat(s: string): string {
  //console.log("DEBUG -> ", s);
  let result: string;

  let tokens: string[] = s.split("/");
  result = tokens[2] + "-" + tokens[1] + "-" + tokens[0];
  //console.log("DEBUG2 -> ", result);
  

  return result;
}

private checkIfIsBetween(test: number, start: number, end: number): boolean {
  if(test >= start && test <= end) return true;
  return false;
}

private getMonthNumberByName(name: string): number {
  switch(name) {
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

public clearMessages(): void {
  this.thereAreMessagesToDiplay = false;
  this.backendMsg = "";

  this.invalidAccommodationError = false;
  this.noAccommodationIdWasProvidedError = false;
  this.errorOccurredWhileFetchingMonthNameOrIndexError = false;
  this.invalidChosenDayError = false;
  this.completedBooking = false;
  this.errorInBookingProcedure = false;
  this.completedUnavailabilitySettingMessage = false;
  this.userNotLoggedError = false;
  this.accommodationInfoError = false;
}

}
