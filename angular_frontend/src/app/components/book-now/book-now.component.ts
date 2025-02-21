import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  //Messagges:
  //------------------------------------------------------------------------------------------------
  thereAreMessagesToDiplay: boolean = false;
  invalidAccommodationError: boolean = false;
  noAccommodationIdWasProvidedError: boolean = false;
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
  get currentMonth(): string {
    return this.currentDate.toLocaleString('default', { month: 'long' });
  }

  // Getter per l'anno corrente
  get currentYear(): number {
    return this.currentDate.getFullYear();
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
  const nextMonthDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
  return nextMonthDate.toLocaleString('default', { month: 'long' });
}

public clearMessages(): void {
  this.thereAreMessagesToDiplay = false;

  this.invalidAccommodationError = false;
  this.noAccommodationIdWasProvidedError = false;
}

}
