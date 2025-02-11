import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  messages: string[] = [];


  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let tmp = JSON.parse(localStorage.getItem("created_booking")!);
    this.createdBooking = new Booking(tmp._accommodation, tmp._timestamp, tmp._price, tmp._status, tmp._check_in, tmp._check_out, tmp._is_unavailability, tmp._user_id);
    //console.log(this.createdBooking.accommodation);
    tmp = JSON.parse(localStorage.getItem("num_guests")!);
    this.numGuests = Number(tmp);
    
    tmp = JSON.parse(localStorage.getItem("chosen_availability_data")!);
    this.pricePerNight = tmp.chosen_availability.price_per_night;
    this.nightsNumber = tmp.nights_number;
    this.postOperation = tmp.post_operation;
  }

  goBack() {
    localStorage.removeItem("created_booking");
    this.router.navigate(["/accommodation/" + this.createdBooking.accommodation.id]);
    return;
  }

  bookNow() {
    this.createdBooking.check_in = this.convertToCompatibleDateStringFormat(this.createdBooking.check_in);
    this.createdBooking.check_out = this.convertToCompatibleDateStringFormat(this.createdBooking.check_out);
    this.bookingService.newBooking(this.createdBooking).subscribe(
      response => {
        if("message" in response) {
          this.messages.push(response.message);
          console.log("ERRORE");
          return;
        }
        else {
          this.messages.push("Created Booking ID -> " + response.id);
          this.messages.push("Redirect in few seconds...");
          
          setTimeout(() => this.goBack(), 3500);
        }
      }
    );
  }

  //From dd/MM/yyyy to yyyy-MM-dd:
  private convertToCompatibleDateStringFormat(date: string): string {
    console.log("confirm booking booknow convertToCompatibleDateStringFormat -> received: ", date);
    let tokens: string[] = date.split('/');
    return tokens[2] + '-' + tokens[1] + '-' + tokens[0];
  }

  clearMessages() {
    this.messages = [];
  }

  addMessage(msg: string) {
    this.messages.push(msg);
  }

}
