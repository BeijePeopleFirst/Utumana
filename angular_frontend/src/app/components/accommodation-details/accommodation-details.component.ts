import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Accommodation } from 'src/app/models/accommodation';
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

  showEditCityProvCountry: boolean = false;
  cityInputField?: string;
  provinceInputField?: string;
  countryInputField?: string;

  message?: string;


  constructor(
    private accommodationService: AccommodationService,
    private userService: UserService,
    private route: ActivatedRoute
  ) 
  {}

  ngOnInit(): void {

    let id: (string | undefined | null) = this.route.snapshot.params["accommodation_id"];

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

          this.userId = localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : undefined;

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
                  return;
                }
                else {
                  this.invalidUserId = false;

                  if(user.isAdmin) this.isAdminOrMe = true;
                  else {
                    if(user.id == this.accommodation.ownerId) this.isAdminOrMe = true;
                    else this.isAdminOrMe = false;
                  }
                }
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
            this.message = "Added to favourites -> " + result;
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
            this.message = "Removed from favourites -> " + result;
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
            this.message = "Deleted Accommodation -> " + result;
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

  clearMessage() {
    this.message = undefined;
  }

}
