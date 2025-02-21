import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { USE_DEFAULT_LANG } from '@ngx-translate/core';
import { Accommodation } from 'src/app/models/accommodation';
import { Availability } from 'src/app/models/availability';
import { AccommodationService } from 'src/app/services/accommodation.service';

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
  selectedCheckoout?: number;
  //------------------------------------------------------------------------------------------------

  //Messagges:
  //------------------------------------------------------------------------------------------------
  thereAreMessagesToDiplay: boolean = false;
  invalidAccommodationError: boolean = false;
  noAccommodationIdWasProvidedError: boolean = false;
  errorOccurredWhileFetchingMonthNameOrIndexError: boolean = false;
  invalidChosenDayError: boolean = false;
  //------------------------------------------------------------------------------------------------

  // Data corrente per il calendario principale
  currentDate: Date = new Date();

  // Matrici per i due calendari (array di settimane, ogni settimana è un array di 7 giorni)
  calendarLeft: (number | null)[][] = [];
  calendarRight: (number | null)[][] = [];


  constructor(
    private accommodationService: AccommodationService,
    private route: ActivatedRoute
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
  console.log(this.getMonthName(nextMonthDate.getMonth()));
  return this.getMonthName(nextMonthDate.getMonth());
}

resetSelectedDates() {
  this.selectedCheckIn = undefined;
  this.selectedCheckoout = undefined;
}

isSelected(year: number, monthName: string, day: number | null): boolean {

  if(!day) return false;
  let toTest: number = Date.parse(new Date(year, this.getMonthNumberByName(monthName), day) + "");

  return this.checkIfIsBetween(toTest, this.selectedCheckIn!, this.selectedCheckoout!);
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
  let chosenDate: number = Date.parse(new Date(y, this.getMonthNumberByName(monthName), day) + "");

  if(!this.selectedCheckIn) this.selectedCheckIn = chosenDate;
  else {
    this.selectedCheckoout = chosenDate;
    console.log(new Date(this.selectedCheckIn!), new Date(this.selectedCheckoout!));
  }
}

//TODO:
//Need to keep in mind both "real" booking and unavailability option
//After the storing procedure you should send a message into the GUI AND then redirect to the Homepage
confirmSelectedDates(): void {

}

isAnAvailability(y: number, monthName: string, day: number | null): boolean {
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

    if(this.checkIfIsBetween(dateToAnalize, start, end)) return true;
  }

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

  this.invalidAccommodationError = false;
  this.noAccommodationIdWasProvidedError = false;
  this.errorOccurredWhileFetchingMonthNameOrIndexError = false;
  this.invalidChosenDayError = false;
}

}
