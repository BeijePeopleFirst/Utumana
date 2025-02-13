import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap } from 'rxjs';
import { Accommodation } from 'src/app/models/accommodation';
import { Booking } from 'src/app/models/booking';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { ServiceService } from 'src/app/services/service.service';
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

  private servicesSearchBarInputToken$: Subject<string> = new Subject<string>();
  foundServices$!: Observable<Service[]>;
  private selectedServices: Service[] = [];

  selectedServicesView$: BehaviorSubject<Service[]> = new BehaviorSubject<Service[]>([]);

  message?: string;

  //Child Communication:
  chosenAvailability?: {start_date: string, end_date: string, price_per_night: number, accommodation_id: number};
  queryParams?: Params;


  constructor(
    private accommodationService: AccommodationService,
    private userService: UserService,
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router
  ) 
  {}

  ngOnInit(): void {

    this.queryParams = this.route.snapshot.queryParams;

    let id: (string | undefined | null) = this.route.snapshot.params["id"];

    if(!id || id == "") {
      this.invalidAccommodation = true;
      return;
    }

    let tmp: any;
    if(tmp = localStorage.getItem("chosen_availability_data")) {
      let dataSession = JSON.parse(tmp!);
      this.chosenAvailability = {start_date: dataSession.chosen_availability.start_date, end_date: dataSession.chosen_availability.end_date, price_per_night: dataSession.chosen_availability.price_per_night, accommodation_id: dataSession.chosen_availability.accommodation_id};
      this.postOperation$.next(dataSession.post_operation);
      this.nightsNumber$.next(dataSession.nights_number);

      localStorage.removeItem("chosen_availability_data");
    }

    if(localStorage.getItem("num_guests")) {
      this.guestsNumber = JSON.parse(localStorage.getItem("num_guests")!);
      localStorage.removeItem("num_guests");
    }

    if(localStorage.getItem("created_booking")) localStorage.removeItem("created_booking");

    this.accommodationService.getAccommodationById(Number(id)).subscribe(
      data => {
        if(!data) {
          this.invalidAccommodation = true;
        }
        else {
          this.invalidAccommodation = false;
          this.accommodation = data;

          console.log("STAMPO ACC trovata -> ", this.accommodation);

          for(let s of this.accommodation.services)
            this.selectedServices.push(new Service(s.id, s.title, s.icon_url));

          this.selectedServicesView$.next(this.selectedServices);

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
                  if(this.translateService.currentLang === "en-US") this.message = "Error inside Accommodation Entity: ABORT";
                  if(this.translateService.currentLang === "it-IT") this.message = "Errore nell' entita' Accommodation: ANNULLAMENTO";
                  this.invalidAccommodation = true;
                  return;
                }
                this.userService.getUserById(this.accommodation.owner_id).subscribe(
                  foundUser => {
                    if(!foundUser) {
                      if(this.translateService.currentLang === "en-US") this.message = "Error inside Accommodation Entity: ABORT";
                      if(this.translateService.currentLang === "it-IT") this.message = "Errore nell' entita' Accommodation: ANNULLAMENTO";

                      this.invalidAccommodation = true;
                      return;
                    }
                    else if("message" in foundUser) {
                      if(this.translateService.currentLang === "en-US") this.message = "Error inside Accommodation Entity: ABORT\n";
                      if(this.translateService.currentLang === "it-IT") this.message = "Errore nell' entita' Accommodation: ANNULLAMENTO\n";

                      this.message += foundUser.message;
                      this.invalidAccommodation = true;
                      return;
                    }
                    else {
                      this.accommodationOwner = foundUser;
                    }

                    //Lets configure the search services service:
                    this.foundServices$ = this.servicesSearchBarInputToken$.pipe(
                      // wait 300ms after each keystroke before considering the term
                      debounceTime(300),

                      // ignore new term if same as previous term: need to test this one
                      //distinctUntilChanged(),

                      // switch to new search observable each time the term changes
                      switchMap((term: string) =>
                        this.serviceService.searchServices(term).pipe(
                          map(res => {
                            if("message" in res) {
                              this.message = res.message + ", status: " + res.status;
                              return [];
                            }
                            else return res;
                          })
                        )
                      )
                    );
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
            if(this.translateService.currentLang === "en-US") this.message = "An Error Occurred";
            if(this.translateService.currentLang === "it-IT") this.message = "Si è verificato un Errore";
            
            return;
          }
          else if("message" in result) {
            this.message = result.message;
            return;
          }
          else {
            if(this.translateService.currentLang === "en-US") this.message = "Added to favourites -> " + result.toString();
            if(this.translateService.currentLang === "it-IT") this.message = "Aggiunto ai Preferiti -> " + result.toString();

            return;
          }
        }
      );

    else this.accommodationService.removeFavourite(this.userId, this.accommodation.id).subscribe(
        result => {
          if(!result) {
            if(this.translateService.currentLang === "en-US") this.message = "An Error Occurred";
            if(this.translateService.currentLang === "it-IT") this.message = "Si è verificato un Errore";

            return;
          }
          else if("message" in result) {
            this.message = result.message;
            return;
          }
          else {
            if(this.translateService.currentLang === "en-US") this.message = "Removed from favourites -> " + result.toString();
            if(this.translateService.currentLang === "it-IT") this.message = "Rimosso dai Preferiti -> " + result.toString();

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
            if(this.translateService.currentLang === "en-US") this.message = "An Error Occurred";
            if(this.translateService.currentLang === "it-IT") this.message = "Si è verificato un Errore";

            return;
          }
          else if("message" in result) {
            console.error(result.message);
            this.message = result.message;
            return;
          }
          else {
            console.log("Deleted Accommodation -> ", result);
            if(this.translateService.currentLang === "en-US") this.message = "Deleted Accommodation -> " + result.toString();
            if(this.translateService.currentLang === "it-IT") this.message = "Accommodation Rimossa -> " + result.toString();

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

      if(this.translateService.currentLang === "en-US") this.message = "Country is REQUIRED";
      if(this.translateService.currentLang === "it-IT") this.message = "Il Paese è RICHIESTO";

      return;
    }

    if(!this.CAPInputField) {
      this.toggleEditCityProvCountry();

      if(this.translateService.currentLang === "en-US") this.message = "CAP is REQUIRED";
      if(this.translateService.currentLang === "it-IT") this.message = "Il CAP è RICHIESTO";
      
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
        if(!result) {
          if(this.translateService.currentLang === "en-US") this.message = "An error occurred";
          if(this.translateService.currentLang === "it-IT") this.message = "Si è verificato un Errore";
        }
        else if("message" in result) this.message = result.message;
        else {
          if(this.translateService.currentLang === "en-US") this.message = "updated Accommodation -> " + result.toString();
          if(this.translateService.currentLang === "it-IT") this.message = "Accommodation Aggiornata -> " + result.toString();
        }

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
      if(this.translateService.currentLang === "en-US") this.message = "Rooms number and Beds number are both required";
      if(this.translateService.currentLang === "it-IT") this.message = "I numeri di Stanze e Letti sono richiesti";

      return;
    }

    this.accommodation.beds = Number(this.bedsNum);
    this.accommodation.rooms = Number(this.roomsNum);

    console.log("STAMPO PRIMA DEL METODO -> ", this.accommodation);

    this.accommodationService.updateAccommodationInfo(this.accommodation).subscribe(
      result => {
        if(!result) {
          if(this.translateService.currentLang === "en-US") this.message = "An error occurred";
          if(this.translateService.currentLang === "it-IT") this.message = "Si è verificato un Errore";
        }
        else if("message" in result) this.message = result.message;
        else {
          if(this.translateService.currentLang === "en-US") this.message = "Updated Accommodation -> " + result.toString();
          if(this.translateService.currentLang === "it-IT") this.message = "Accommodation Aggiornata -> " + result.toString();
        }

        this.toggleEditRoomsBeds();
      }
    );
  }

  bookNow() {

    if(!this.chosenAvailability || !this.chosenAvailability.start_date || !this.chosenAvailability.end_date || !this.userId || !this.accommodation) {
      if(this.translateService.currentLang === "en-US") this.message = "Some values for Booking are Missing!";
      if(this.translateService.currentLang === "it-IT") this.message = "Alcuni valori per il Booking sono Assenti!";
      return;
    }

    let booking: Booking = new Booking(this.accommodation, (new Date()).toLocaleDateString(), this.postOperation$.value, BookingStatus.PENDING, this.chosenAvailability?.start_date!, 
                                          this.chosenAvailability?.end_date!, false, this.userId!);

    let container: {chosen_availability: {start_date: string, end_date: string, price_per_night: number, accommodation_id: number},
                    nights_number: number, post_operation: number
                   }

                   = {chosen_availability: this.chosenAvailability!, nights_number: this.nightsNumber$.value, post_operation: this.postOperation$.value};

    localStorage.setItem("created_booking", JSON.stringify(booking));
    localStorage.setItem("num_guests", JSON.stringify(this.guestsNumber));
    localStorage.setItem("chosen_availability_data", JSON.stringify(container));
    this.router.navigate(["/confirm_booking_on_creation"], {queryParams: {userId: this.userId!}});
    return;
  }

  showEditServicesPerspective: boolean = false;
  toggleEditServicesPerspective() {
    this.showEditServicesPerspective = !this.showEditServicesPerspective;
  }

  searchServices(token: string): void {
    this.servicesSearchBarInputToken$.next(token);
  }

  searchBarFocusAction(): void {
    this.servicesSearchBarInputToken$.next("");
  }

  //It provides an invalid random string in order to trigger the subscribed observable:
  searchBarOutFocusAction(): void {
    this.servicesSearchBarInputToken$.next((Math.random() * 1000) + "");
  }

  removeSelectedService(service: Service) {
    this.selectedServices = this.selectedServices.filter(s => s.id !== service.id);
    this.selectedServicesView$.next(this.selectedServices);
  }

  elaborateCheckbox(input: boolean, s: Service): void {
    //input -> Sarà "true" o "false"
    if(input) this.selectedServices.push(s);
    else this.selectedServices = this.selectedServices.filter(ser => ser.id !== s.id);

    this.selectedServicesView$.next(this.selectedServices);
  }

  isSelectedService(service: Service): boolean {
    for(let s of this.selectedServices)
      if(s.id == service.id) return true;

    return false;
  }

  confirmServices(): void {
    
    this.accommodationService.setAccommodationServices(this.accommodation, this.selectedServices).subscribe(
      result => {

        if("message" in result) {
          this.message = result.message;
          return;
        }
        else {
          if(this.translateService.currentLang === "en-US") this.message = "Successfully updated Accommodation Services";
          if(this.translateService.currentLang === "it-IT") this.message = "Servizi dell' Accommodation aggiornati con Successo";
          
          this.toggleEditServicesPerspective();
        }
      }
    )
  }

  clearMessage() {
    this.message = undefined;
  }

}
