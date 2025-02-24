import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { USE_DEFAULT_LANG } from '@ngx-translate/core';
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
  selectedAccommodationAvailabilities: Availability[] = [];
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
    this.generateCalendars();

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
        
      }
    )
  }

  // Getter per il nome del mese corrente (es. "marzo")
  public getMonthName(monthIndexLocal?: number): string {
    let monthIndex: number = monthIndexLocal ? monthIndexLocal : this.currentDate.getMonth();

    switch(monthIndex) {
      case 0: return "january";
      case 1: return "february";
      case 2: return "march";
      case 3: return "april";
      case 4: return "may";
      case 5: return "june";
      case 6: return "july";
      case 7: return "august";
      case 8: return "september";
      case 9: return "october";
      case 10: return "november";
      case 11: return "december";
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
  
  if(this.currentDate.getMonth() === 11) return "january";

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
  if(this.getMonthName() === "december") return "january";
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

availabilitiesOrNotKeys: Map<String, Boolean> = new Map<String, Boolean>(); 
isAnAvailability(y: number, monthName: string, day: number | null): boolean {

  //Se la data c'è già la restituisco:
  if(this.availabilitiesOrNotKeys.has(y + "-" + monthName + "-" + day)) return this.availabilitiesOrNotKeys.get(y + "-" + monthName + "-" + day)!.valueOf();

  let monthNumber: number = this.getMonthNumberByName(monthName);

  if(!day) return false;

  if(monthNumber === -1) {
    this.thereAreMessagesToDiplay = true;
    this.errorOccurredWhileFetchingMonthNameOrIndexError = true;
    return false;
  }

  let dateToAnalize: number = Date.parse(new Date(y, monthNumber, day) + "");

  let start: number;
  let end: number;
  for(let a of this.accommodation.availabilities) {
    start = Date.parse(a.start_date);
    end = Date.parse(a.end_date);

    if(this.checkIfIsBetween(dateToAnalize, start, end)) {

      //Lets add to the cache this availability:
      this.availabilitiesOrNotKeys.set(y + "-" + monthName + "-" + day, true);

      return true;
    }
  }

  this.availabilitiesOrNotKeys.set(y + "-" + monthName + "-" + day, false);
  return false;
}

private checkIfIsBetween(test: number, start: number, end: number): boolean {
  if(test >= start && test <= end) return true;
  return false;
}

private getMonthNumberByName(name: string): number {
  switch(name) {
    case "january": return 0;
    case "february": return 1;
    case "march": return 2;
    case "april": return 3;
    case "may": return 4;
    case "june": return 5;
    case "july": return 6;
    case "august": return 7;
    case "september": return 8;
    case "october": return 9;
    case "november": return 10;
    case "december": return 11;
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
}

}
