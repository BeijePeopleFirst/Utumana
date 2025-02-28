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
  selectedAccommodationAvailabilities: Availability[] = [];
  isMe!: boolean;
  private unavailabilities: string[] = [];
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
            if(responseInfo2["isAdmin"] == null || responseInfo2["isOwner"] == null || responseInfo2["pendingByUserOrAcceptedOrDoingBookings"] == null) {
              this.thereAreMessagesToDiplay = true;
              this.accommodationInfoError = true;
              return;
            }
            
            this.isMe = Boolean(responseInfo2["isOwner"]).valueOf();

            //Now lets insert values into the unavailabilities Map:
            let tmp: BookingDTO[] = [];
            let tempBooking: BookingDTO;

            //Aggiungo i valori alla lista "tmp":
            for(let v of responseInfo2["pendingByUserOrAcceptedOrDoingBookings"]) {
              tempBooking = {
                check_in: v.checkIn, 
                check_out: v.checkOut, 
                price: 0, 
                status: "",
                accommodation: {id: this.accommodation.id!, title: this.accommodation.title, city: this.accommodation.city!, main_photo_url: this.accommodation.main_photo_url, country: this.accommodation.country, province: this.accommodation.province!, min_price: 0, max_price: 0, is_favourite: false, rating: 0}
              };

              tmp.push(tempBooking);
            }console.log("STAMPO TMP -> ", tmp);

            let inDateN: number;
            let outDateN: number;

            let date: Date;

            let monthName: string;
            let year: number;
            let day: number;

            let cursor: number;

            for(let b of tmp) {
              inDateN = Date.parse(b.check_in);
              outDateN = Date.parse(b.check_out);

              cursor = inDateN;

              while(cursor <= outDateN) {
                date = new Date(cursor);

                monthName = this.getMonthName(date.getMonth());
                year = date.getFullYear();
                day = date.getDate();

                this.unavailabilities.push(year + "-" + monthName + "-" + day);

                cursor = new Date(year, date.getMonth(), day + 1).getTime();
              }
              
            }

            this.generateCalendars();
          }
        )
        
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

  let dateToAnalize: number = new Date(y, monthNumber, day, 0, 0, 0).getTime();

  //DEBUG:
  /*if(monthNumber === 3) {
    console.log(this.accommodation.availabilities)
    for(let a of this.accommodation.availabilities) {
      if(new Date(a.start_date).getMonth() === 3 && new Date(a.start_date).getDate() === 1) {
        console.log("APRIL");
        console.log("CHECK", "To Analize: " + dateToAnalize, "Start: ", Date.parse(a.start_date));
        console.log("PROVA -> ", new Date())
        let tmp = a.start_date.split("-");
        console.log("RESULT ", new Date(Number(tmp[0]), 3, Number(tmp[2]), 0, 0, 0).getTime(), dateToAnalize);
      }
    }
  }*/

  //If the day to analize is passed already, then it will not be selectable
  if(dateToAnalize < Date.now()) {
    this.availabilitiesOrNotKeys.set(y + "-" + monthName + "-" + day, false);
    return false;
  }
  
  //Now I check if the date is in the booked already Array: if so then it will not be selectable.
  if(this.unavailabilities.includes(y + "-" + monthName + "-" + day)) {
    this.availabilitiesOrNotKeys.set(y + "-" + monthName + "-" + day, false);
    return false;
  }

  let start: number;
  let end: number;
  //let tmpArr: string[];
  //let tmpDate: Date;
  for(let a of this.accommodation.availabilities) {

    /*tmpArr = a.start_date.split("-");
    tmpDate = new Date(Date.parse(a.start_date));
    tmpDate = new Date(Number(tmpArr[0]), tmpDate.getMonth(), Number(tmpArr[2]), 0, 0, 0);*/
    
    start = this.createDateInMilliseconds(a, "start_date");

    /*tmpArr = a.end_date.split("-");
    tmpDate = new Date(Date.parse(a.end_date));
    tmpDate = new Date(Number(tmpArr[0]), tmpDate.getMonth(), Number(tmpArr[2]), 0, 0, 0);*/
    
    end = this.createDateInMilliseconds(a, "end_date");

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

//Example: createDateInMilliseconds(a, "start_date")
private createDateInMilliseconds(av: Availability, field: string): number {

  let a = av as any;

  let tmpArr: string[];
  let tmpDate: Date;

  tmpArr = a[field].split("-");
  tmpDate = new Date(Date.parse(a[field]));
  tmpDate = new Date(Number(tmpArr[0]), tmpDate.getMonth(), Number(tmpArr[2]), 0, 0, 0);

  return tmpDate.getTime();
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
  this.accommodationInfoError = false;
}

}
