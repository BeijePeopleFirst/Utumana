import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap } from 'rxjs';
import { Accommodation } from 'src/app/models/accommodation';
import { Booking } from 'src/app/models/booking';
import { Review } from 'src/app/models/review';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { ServiceService } from 'src/app/services/service.service';
import { UserService } from 'src/app/services/user.service';
import { BookingStatus } from 'src/app/utils/enums';
import iconURL from 'src/costants';

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

  accommodationReviews: Review[] = [];
  filteredAccommodationReviews: Review[] = [];
  accommodationReviewsPageNumber: number = 0;
  accommodationReviewsTotalPagesNumber!: number;

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

  //MESSAGGES:
  //-------------------------------------------------------------------------------------
  message?: string;

  accommodationEntityError: boolean = false;
  errorOccurred: boolean = false;
  addedToFavourites: boolean = false;
  removedFromFavourites: boolean = false;
  deletedAccommodation: boolean = false;
  countryRequired: boolean = false;
  capRequired: boolean = false;
  updatedAccommodation: boolean = false;
  roomsBedsRequired: boolean = false;
  bookingValuesMissing: boolean = false;
  updatedAccommodationServices: boolean = false;
  errorFetchingAccommodationDetails: boolean = false;
  errorFetchingAccommodationOwner: boolean = false;
  //-------------------------------------------------------------------------------------


  iconUrl = iconURL

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

    //recupero l' accommodation:
    this.accommodationService.getAccommodationById(Number(id)).subscribe(
      result => {
        if(!result) {
          this.invalidAccommodation = true;
          return;
        }
        this.invalidAccommodation = false;
        this.accommodation = result;

        console.log("STAMPO ACC trovata -> ", this.accommodation);

        //Recupero i Servizi dell' Accommodation:
        for (let s of this.accommodation.services)
          this.selectedServices.push(new Service(s.id, s.title, s.icon_url));

        this.selectedServicesView$.next(this.selectedServices);

        //Verifico se lo User è loggato:
        this.userId = localStorage.getItem("id") ? Number(localStorage.getItem("id")) : undefined;

        if (!this.userId) {
          this.userNotLogged = true;
          return;
        }

        this.userNotLogged = false;   

        //Recupero informazioni associate all' Accommodation:
        this.accommodationService.getAccommodationInfo(this.accommodation.id!).subscribe(
          info => {
            if("message" in info) {
              this.message = info.message;
              console.error(info.message);
              this.errorFetchingAccommodationDetails = true;
              return;
            }
            
            this.invalidUserId = false;

            let tmp1: Boolean | undefined;
            let tmp2: Boolean | undefined;
            let tmp3: any;
            let tmp4: Boolean | undefined;

            if(!("isAdmin" in info) || !("isOwner" in info) || !("reviews" in info) || !("isFavourite" in info)
              || !(tmp1 = Boolean(info["isAdmin"])) || !(tmp2 = Boolean(info["isOwner"]))
              || !(tmp3 = info["reviews"]) || ((tmp4 = Boolean(info["isFavourite"])) == undefined)) {

              this.errorFetchingAccommodationDetails = true;
              this.message = "true";
              return;
            }
            
            this.isAdminOrMe = (tmp1.valueOf() || tmp2.valueOf());
            this.isFavourite = tmp4.valueOf();

            if(!(Array.isArray(tmp3))) {
              this.errorFetchingAccommodationDetails = true;
              this.message = "true";
              return;
            }
            else {
              
              //Recupero le Review
              for(let r of tmp3) {
                this.accommodationReviews.push(new Review(r.title, r.description, r.overall_rating, r.comfort,
                                                r.convenience, r.position, r.id, r.approval_timestamp, r.booking_id
                                                )
                                              )
              } 
            }
            
            console.log("Reviews -> ", this.accommodationReviews);

            //Filtro le review in base al tipo di User loggato:
            if(!this.isAdminOrMe) this.accommodationReviews = this.accommodationReviews.filter(r => r.approval_timestamp != null);

            //Ordino le Review per ID ascendente:
            this.accommodationReviews.sort((s1, s2) => s1.id! - s2.id!);

            //Adesso ottengo le review in base al numero di pagina:
            this.filteredAccommodationReviews = this.getDesiredReviewsByPageNumber(this.accommodationReviewsPageNumber, this.accommodationReviews);

            //Ora calcolo il numero di pagine:
            this.accommodationReviewsTotalPagesNumber = Math.ceil(this.accommodationReviews.length / 4);

            //Ora recupero l' Owner dell' Accommodation:
            this.userService.getUserById(this.accommodation.owner_id).subscribe(
              foundUser => {
                if(!foundUser) {
                  this.message = "true";
                  this.accommodationEntityError = true;
                  this.invalidAccommodation = true;
                  return;
                }
                else if("message" in foundUser) {
                  this.message = foundUser.message;
                  this.invalidAccommodation = true;
                  this.errorFetchingAccommodationOwner = true;
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
                )
              }
            )
          }
        )
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
            this.message = "true";
            this.errorOccurred = true;
            
            return;
          }
          else if("message" in result) {
            this.message = result.message;
            return;
          }
          else {
            this.message = "true";
            this.addedToFavourites = true;
            return;
          }
        }
      );

    else this.accommodationService.removeFavourite(this.userId, this.accommodation.id).subscribe(
        result => {
          if(!result) {
            this.message = "true";
            this.errorOccurred = true;
            return;
          }
          else if("message" in result) {
            this.message = result.message;
            return;
          }
          else {
            this.message = "true";
            this.removedFromFavourites = true;
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
            this.message = "true";
            this.errorOccurred = true;
            return;
          }
          else if("message" in result) {
            console.error(result.message);
            this.message = result.message;
            return;
          }
          else {
            console.log("Deleted Accommodation -> ", result);
            this.message = "true";
            this.deletedAccommodation = true;
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

      this.message = "true";
      this.countryRequired = true;
      return;
    }

    if(!this.CAPInputField) {
      this.toggleEditCityProvCountry();

      this.message = "true";
      this.capRequired = true;
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
          this.message = "true";
          this.errorOccurred = true;
        }
        else if("message" in result) this.message = result.message;
        else {
          this.message = "true";
          this.updatedAccommodation = true;
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
      this.message = "true";
      this.roomsBedsRequired = true;
      return;
    }

    this.accommodation.beds = Number(this.bedsNum);
    this.accommodation.rooms = Number(this.roomsNum);

    console.log("STAMPO PRIMA DEL METODO -> ", this.accommodation);

    this.accommodationService.updateAccommodationInfo(this.accommodation).subscribe(
      result => {
        if(!result) {
          this.message = "true";
          this.errorOccurred = true;
        }
        else if("message" in result) this.message = result.message;
        else {
          this.message = "true";
          this.updatedAccommodation = true;
        }

        this.toggleEditRoomsBeds();
      }
    );
  }

  bookNow() {

    if(!this.chosenAvailability || !this.chosenAvailability.start_date || !this.chosenAvailability.end_date || !this.userId || !this.accommodation) {
      this.message = "true";
      this.bookingValuesMissing = true;
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

    this.accommodation.services = this.selectedServices;
    
    this.accommodationService.setAccommodationServices(this.accommodation, this.selectedServices).subscribe(
      result => {

        if("message" in result) {
          this.message = result.message;
          return;
        }
        else {
          this.message = "true";
          this.updatedAccommodationServices = true;
          
          this.toggleEditServicesPerspective();
        }
      }
    )
  }

  //TODO:
  //PageSize === 4
  getDesiredReviewsByPageNumber(pageNumber: number, reviews: Review[]): Review[] {

  }

  //TODO: prendo n elementi dalla lista delle review in base all' offset specificato
  consumeAskForPageEvent($event: number) {

  }

  //TODO:
  //this.reviewChange.emit({ id: this.review.id, action: 'reject' });
  //this.reviewChange.emit({ id: this.review.id, action: 'accept' });
  consumeReviewActionEvent($event: { id:number, action:string }) {

  }

  clearMessage() {
    this.message = undefined;

    this.accommodationEntityError = false;
    this.errorOccurred = false;
    this.addedToFavourites = false;
    this.removedFromFavourites = false;
    this.deletedAccommodation = false;
    this.countryRequired = false;
    this.capRequired = false;
    this.updatedAccommodation = false;
    this.roomsBedsRequired = false;
    this.bookingValuesMissing = false;
    this.updatedAccommodationServices = false;
    this.errorFetchingAccommodationDetails = false;
    this.errorFetchingAccommodationOwner = false;

  }

}
