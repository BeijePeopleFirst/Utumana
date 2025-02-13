import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Availability } from 'src/app/models/availability';
import { Booking } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-confirm-booking-booknow',
  templateUrl: './confirm-booking-booknow.component.html',
  styleUrls: ['./confirm-booking-booknow.component.css']
})
export class ConfirmBookingBooknowComponent implements OnInit {

  createdBooking!: Booking;
  numGuests!: number;
  chosenAvailability:any;
  pricePerNight!: number;
  nightsNumber!:number;
  postOperation!:number;

  isUnavailability!: boolean;
  isMe!: boolean;

  messages: string[] = [];

  tmp!: any;


  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tmp = JSON.parse(localStorage.getItem("created_booking")!);
    this.createdBooking = new Booking(this.tmp._accommodation, this.tmp._timestamp, this.tmp._price, this.tmp._status, this.tmp._check_in, this.tmp._check_out, this.tmp._is_unavailability, this.tmp._user_id);
    //console.log(this.createdBooking.accommodation);

    if(this.route.snapshot.queryParams["userId"] && this.createdBooking.accommodation.owner_id === +this.route.snapshot.queryParams["userId"]) this.isMe = true;
    else this.isMe = false;

    this.tmp = JSON.parse(localStorage.getItem("num_guests")!);
    this.numGuests = Number(this.tmp);
    
    this.tmp = JSON.parse(localStorage.getItem("chosen_availability_data")!);
    this.pricePerNight = this.tmp.chosen_availability.price_per_night;
    this.nightsNumber = this.tmp.nights_number;
    this.postOperation = this.tmp.post_operation;
  }

  invalidDateProvided!: boolean;
  goBack() {
    localStorage.removeItem("created_booking");
    let checkInDateStr: string = this.convertToCompatibleDateStringFormat(this.createdBooking.check_in) !== "Error" ? this.convertToCompatibleDateStringFormat(this.createdBooking.check_in) : this.createdBooking.check_in;
    if(this.invalidDateProvided) return;
    
    let checkOutDateStr: string = this.convertToCompatibleDateStringFormat(this.createdBooking.check_out) !== "Error" ? this.convertToCompatibleDateStringFormat(this.createdBooking.check_out) : this.createdBooking.check_out;
    if(this.invalidDateProvided) return;
    
    this.router.navigate(["/accommodation/" + this.createdBooking.accommodation.id], {queryParams: {start_date: checkInDateStr, end_date: checkOutDateStr}});
    return;
  }

  bookNow() {
    this.createdBooking.is_unavailability = this.isUnavailability;

    this.invalidDateProvided = false;

    this.createdBooking.check_in = this.convertToCompatibleDateStringFormat(this.createdBooking.check_in) !== "Error" ? this.convertToCompatibleDateStringFormat(this.createdBooking.check_in) : this.createdBooking.check_in;
    if(this.invalidDateProvided) return;

    this.createdBooking.check_out = this.convertToCompatibleDateStringFormat(this.createdBooking.check_out) !== "Error" ? this.convertToCompatibleDateStringFormat(this.createdBooking.check_out) : this.createdBooking.check_out;
    if(this.invalidDateProvided) return;
    
    if(!this.isUnavailability)
      this.bookingService.newBooking(this.createdBooking).subscribe(
        response => {
          if("message" in response) {
            this.messages.push(response.message);
            console.log("ERRORE");
            return;
          }
          else {
            if(this.translateService.currentLang === 'en-US') this.messages.push("Created Booking STATUS -> " + response.status);
            if(this.translateService.currentLang === "it-IT") this.messages.push("STATO del Booking Creato -> " + response.status);

            this.tmp.chosen_availability.start_date = this.createdBooking.check_in;
            this.tmp.chosen_availability.end_date = this.createdBooking.check_out;
            localStorage.setItem("chosen_availability_data", JSON.stringify(this.tmp));

            this.tmp = JSON.parse(localStorage.getItem("num_guests")!);
            this.tmp = this.numGuests;
            localStorage.setItem("num_guests", JSON.stringify(this.tmp));

            if(this.translateService.currentLang === 'en-US') this.messages.push("Redirect in few seconds...");
            if(this.translateService.currentLang === 'it-IT') this.messages.push("Cambio di Pagina tra qualche secondo...");
            
            setTimeout(() => this.goBack(), 3500);
          }
        }
      );

    else {
      let unavailability: Availability = new Availability();
      unavailability.accommodation_id = this.createdBooking.accommodation.id!;
      unavailability.start_date = this.createdBooking.check_in;
      unavailability.end_date = this.createdBooking.check_out;
      unavailability.price_per_night = this.pricePerNight;

      this.bookingService.newUnavailability(unavailability).subscribe(
        response => {
          if("message" in response) {
            this.messages.push(response.message);
            console.log("ERRORE");
            return;
          }
          else {
            if(this.translateService.currentLang === 'en-US') this.messages.push("Created Unavailability ID -> " + response.id);
            if(this.translateService.currentLang === 'it-IT') this.messages.push("ID della Availability Creata -> " + response.id);

            this.tmp.chosen_availability.start_date = this.createdBooking.check_in;
            this.tmp.chosen_availability.end_date = this.createdBooking.check_out;
            localStorage.setItem("chosen_availability_data", JSON.stringify(this.tmp));

            this.tmp = JSON.parse(localStorage.getItem("num_guests")!);
            this.tmp = this.numGuests;
            localStorage.setItem("num_guests", JSON.stringify(this.tmp));

            if(this.translateService.currentLang === 'en-US') this.messages.push("Redirect in few seconds...");
            if(this.translateService.currentLang === 'it-IT') this.messages.push("Cambio di Pagina tra qualche secondo...");
            
            setTimeout(() => this.goBack(), 3500);
          }
        }
      );
    }
  }

  //From dd/MM/yyyy to yyyy-MM-dd:
  private convertToCompatibleDateStringFormat(date: string): string {

    try {
      this.checkDateInput(date);
    }
    catch(ex: any) {
      this.addMessage(ex.message);
      this.invalidDateProvided = true;
      return "Error";
    }

    let tokens: string[] = date.includes('/') ? date.split('/') : date.split('-');

    if(date.includes('/')) return tokens[2] + '-' + tokens[1] + '-' + tokens[0];
    else return tokens[0] + '-' + tokens[1] + '-' + tokens[2];
  }

  private checkDateInput(date: string): void {

    if(!date || date == "") throw new Error("Invalid Date Format provided");

    //-> Accepted Pattern: dd/MM/yyyy
    let dateRegex = /^(0?[1-9]|1[0-9]|2[0-9]|3[01])\/(0?[1-9]|1[0-2])\/([1-9][0-9]{3})$/;

    //-> Accepted Pattern: yyyy-MM-dd
    let dateRegex2 = /^([1-9][0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
    if(!dateRegex.test(date) && !dateRegex2.test(date)) throw new Error("Invalid Date provided");

    if(!this.lecitDateProvided(date)) throw new Error("Invalid Date provided: the specified Date does not exist");

  }

  private lecitDateProvided(date: string): boolean {
    try {
      let args: string[] = date.includes('/') ? date.split('/') : date.split('-');

      let tmp: Date;
      if(date.includes('/')) tmp = new Date(+args[2], +args[1] - 1, +args[0]);
      else tmp = new Date(+args[0], +args[1] - 1, +args[2]);

      if(isNaN(tmp.getTime())) return false;
    }
    catch(ex: any) {
      return false;
    }

    return true;
  }

  clearMessages() {
    this.messages = [];
  }

  addMessage(msg: string) {
    this.messages.push(msg);
  }

}
