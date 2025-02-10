import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Accommodation } from 'src/app/models/accommodation';
import { Booking } from 'src/app/models/booking';
import { User } from 'src/app/models/user';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { UserService } from 'src/app/services/user.service';
import { BookingStatus } from 'src/app/utils/enums';

@Component({
  selector: 'app-accommodation-details',
  templateUrl: './accommodation-details.component.html',
  styleUrls: ['./accommodation-details.component.css']
})
export class AccommodationDetailsComponent implements OnInit {

  userId?: number;

  //A User ID was not provided:
  userNotLogged: boolean = true;

  //Is the provided User ID lecit?
  invalidUserId: boolean = true;

  accommodation!: Accommodation;
  invalidAccommodation: boolean = false;
  isFavourite: boolean = false;
  isAdminOrMe: boolean = false;

  accommodationOwner!: User;

  showEditCityProvCountry: boolean = false;
  cityInputField?: string;
  provinceInputField?: string;
  countryInputField?: string;
  CAPInputField?: string;
  streetInputField?: string;
  strNumInputField?: string;

  showViewMorePhotosPerspective: boolean = false;

  showViewEditRoomsBedsPerspective: boolean = false;
  bedsNum?: string;
  roomsNum?: string;

  showViewEditPhotosPerspective: boolean = false;

  guestsNumber: number = 1;
  nightsNumber$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  postOperation$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  message?: string;

  //Child Communication:
  chosenAvailability?: {start_date: string, end_date: string, price_per_night: number, accommodation_id: number};


  constructor(
    private accommodationService: AccommodationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) 
  {}

  ngOnInit(): void {

    let id: (string | undefined | null) = this.route.snapshot.params["id"];

    if(!id || id == "") {
      this.invalidAccommodation = true;
      return;
    }

    let tmp: any;
    if(tmp = sessionStorage.getItem("chosen_availability_data")) {
      let dataSession = JSON.parse(tmp!);
      this.chosenAvailability = dataSession.chosen_availability;
      this.postOperation$.next(dataSession.postOperation);
      this.nightsNumber$.next(dataSession.nightsNumber);

      sessionStorage.removeItem("chosen_availability_data");
    }

    if(sessionStorage.getItem("created_booking")) sessionStorage.removeItem("created_booking");

    this.accommodationService.getAccommodationById(Number(id)).subscribe(
      data => {
        if(!data) {
          this.invalidAccommodation = true;
        }
        else {
          this.invalidAccommodation = false;
          this.accommodation = data;

          console.log("STAMPO ACC trovata -> ", this.accommodation);

          this.userId = localStorage.getItem("id") ? Number(localStorage.getItem("id")) : undefined;
          //this.userId = 1;

          if(!this.userId) {
            this.userNotLogged = true;
            return;
          }
          else {
            this.userNotLogged = false;

            this.userService.getUserById(this.userId).subscribe(
              user => {
                if(!user || "message" in user) {
                  this.invalidUserId = true;
                  if(user && "message" in user) this.message = user.message;
                  return;
                }
                else {
                  this.invalidUserId = false;

                  if(user.isAdmin) this.isAdminOrMe = true;
                  else {
                    if(user.id == this.accommodation.owner_id) this.isAdminOrMe = true;
                    else this.isAdminOrMe = false;
                  }
                }

                //Now lets retrieve the Accommodation Owner:
                if(!this.accommodation.id) {
                  this.message = "Error inside Accommodation Entity: ABORT";
                  this.invalidAccommodation = true;
                  return;
                }
                this.userService.getUserById(this.accommodation.owner_id).subscribe(
                  foundUser => {
                    if(!foundUser) {
                      this.message = "Error inside Accommodation Entity: ABORT";
                      this.invalidAccommodation = true;
                      return;
                    }
                    else if("message" in foundUser) {
                      this.message = "Error inside Accommodation Entity: ABORT\n";
                      this.message += foundUser.message;
                      this.invalidAccommodation = true;
                      return;
                    }
                    else {
                      this.accommodationOwner = foundUser;
                    }
                  }
                )
              }
            );

            return;
          }
        }
      }
    )
  }

  receiveAvailabilityFromChild($event: { start_date: string; end_date: string; price_per_night: number; accommodation_id: number; } | undefined | {message: string}) {
    if($event && !("message" in $event)) {
      this.chosenAvailability = $event;

      // Calcola il numero di notti
      const startDate = new Date($event.start_date);
      const endDate = new Date($event.end_date);
      const nights = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      this.chosenAvailability.start_date = new Date(this.chosenAvailability.start_date).toLocaleDateString();
      this.chosenAvailability.end_date = new Date(this.chosenAvailability.end_date).toLocaleDateString();

      // Aggiorna i BehaviorSubject
      this.nightsNumber$.next(nights);
      console.log("Stampo price per night -> ", $event.price_per_night);
      this.postOperation$.next(nights * $event.price_per_night);
    }
    else {
      if($event) this.message = $event.message;
    }
  }

  toggleIsFavourite() {
    this.isFavourite = !this.isFavourite;

    if(!this.userId) {
      this.userNotLogged = true;
      return;
    }

    if(!this.accommodation.id) {
      this.invalidAccommodation = true;
      return;
    }

    if(this.isFavourite) this.accommodationService.addFavourite(this.userId, this.accommodation.id).subscribe(
        result => {
          if(!result) {
            this.message = "An Error occurred";
            return;
          }
          else if("message" in result) {
            this.message = result.message;
            return;
          }
          else {
            this.message = "Added to favourites -> " + result.toString();
            return;
          }
        }
      );

    else this.accommodationService.removeFavourite(this.userId, this.accommodation.id).subscribe(
        result => {
          if(!result) {
            this.message = "An Error occurred";
            return;
          }
          else if("message" in result) {
            this.message = result.message;
            return;
          }
          else {
            this.message = "Removed from favourites -> " + result.toString();
            return;
          }
        }
      );

    
  }

  deleteAccommodation() {
    if(this.accommodation.id) this.accommodationService.deleteAccommodation(this.accommodation.id).subscribe(
      result => 
        {
          if(!result) {
            console.error("Error occurred");
            this.message = "Error occurred";
            return;
          }
          else if("message" in result) {
            console.error(result.message);
            this.message = result.message;
            return;
          }
          else {
            console.log("Deleted Accommodation -> ", result);
            this.message = "Deleted Accommodation -> " + result.toString();
            return;
          }
        }
      );
    
      else {
        this.invalidAccommodation = true;
        return;
      }
  }

  toggleEditCityProvCountry() {
    this.showEditCityProvCountry = !this.showEditCityProvCountry;
  }

  confirmFormCityCountryProv() {
    if(!this.countryInputField) {
      this.toggleEditCityProvCountry();
      this.message = "Country is REQUIRED";
      return;
    }

    if(!this.CAPInputField) {
      this.toggleEditCityProvCountry();
      this.message = "CAP is REQUIRED";
      return;
    }

    this.accommodation.street_number = this.strNumInputField?.trim();
    this.accommodation.street = this.streetInputField?.trim();
    this.accommodation.province = this.provinceInputField?.trim();
    this.accommodation.country = this.countryInputField.trim();
    this.accommodation.city = this.cityInputField?.trim();
    this.accommodation.cap = this.CAPInputField.trim();

    if(!this.userId) {
      this.userNotLogged = true;
      return;
    }

    this.accommodationService.updateAccommodationAddress(this.userId, this.accommodation).subscribe(
      result => {
        if(!result) this.message = "An error occurred";
        else if("message" in result) this.message = result.message;
        else this.message = "updated Accommodation -> " + result.toString();

        this.toggleEditCityProvCountry();
      }
    );

  }

  //Need to create the perspective itself
  toggleViewMorePhotosPerspective() {
    this.showViewMorePhotosPerspective = !this.showViewMorePhotosPerspective;
  }

  //Need to create the perspective itself
  toggleEditPhotosPerspective() {
    this.showViewEditPhotosPerspective = !this.showViewEditPhotosPerspective;
  }

  toggleEditRoomsBeds() {
    this.showViewEditRoomsBedsPerspective = !this.showViewEditRoomsBedsPerspective;
  }

  confirmFormRoomsBeds() {
    if(!this.bedsNum || !this.roomsNum) {
      this.message = "Rooms number and Beds number are both required";
      return;
    }

    this.accommodation.beds = Number(this.bedsNum);
    this.accommodation.rooms = Number(this.roomsNum);

    console.log("STAMPO PRIMA DEL METODO -> ", this.accommodation);

    this.accommodationService.updateAccommodationInfo(this.accommodation).subscribe(
      result => {
        if(!result) this.message = "An error occurred";
        else if("message" in result) this.message = result.message;
        else this.message = "Updated Accommodation -> " + result.toString();

        this.toggleEditRoomsBeds();
      }
    );
  }

  bookNow() {

    if(!this.chosenAvailability || !this.chosenAvailability.start_date || !this.chosenAvailability.end_date || !this.userId || !this.accommodation) {
      this.message = "Some values for Booking are Missing!";
      return;
    }

    let booking: Booking = new Booking(this.accommodation, (new Date()).toLocaleDateString(), this.postOperation$.value, BookingStatus.PENDING, this.chosenAvailability?.start_date!, 
                                          this.chosenAvailability?.end_date!, false, this.userId!);

    let container: {chosen_availability: {start_date: string, end_date: string, price_per_night: number, accommodation_id: number},
                    nightsNumber: number, postOperation: number
                   }

                   = {chosen_availability: this.chosenAvailability!, nightsNumber: this.nightsNumber$.value, postOperation: this.postOperation$.value};

    sessionStorage.setItem("created_booking", JSON.stringify(booking));
    sessionStorage.setItem("chosen_availability_data", JSON.stringify(container));
    this.router.navigate(["/confirm_booking_on_creation"]);
    return;
  }

  //TODO + perspective itself
  toggleEditServicesPerspective() {

  }

  clearMessage() {
    this.message = undefined;
  }

}
