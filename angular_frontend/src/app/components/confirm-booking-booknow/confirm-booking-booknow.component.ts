import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from 'src/app/models/booking';

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


  constructor(
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

  //TODO:
  bookNow() {

  }

}
