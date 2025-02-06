import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Accommodation } from 'src/app/models/accommodation';
import { User } from 'src/app/models/user';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { UserService } from 'src/app/services/user.service';

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

  message?: string;


  constructor(
    private accommodationService: AccommodationService,
    private userService: UserService,
    private route: ActivatedRoute
  ) 
  {}

  ngOnInit(): void {

    let id: (string | undefined | null) = this.route.snapshot.params["id"];

    if(!id || id == "") {
      this.invalidAccommodation = true;
      return;
    }

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

  clearMessage() {
    this.message = undefined;
  }

}
