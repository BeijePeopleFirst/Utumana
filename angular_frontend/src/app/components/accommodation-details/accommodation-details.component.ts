import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, of, Subject, Subscription, switchMap } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { BookingDTO } from 'src/app/dtos/bookingDTO';
import { Accommodation } from 'src/app/models/accommodation';
import { Availability } from 'src/app/models/availability';
import { Booking } from 'src/app/models/booking';
import { Coordinates } from 'src/app/models/coordinates';
import { Review } from 'src/app/models/review';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { DraftService } from 'src/app/services/draft.service';
import { ReviewService } from 'src/app/services/review.service';
import { ServiceService } from 'src/app/services/service.service';
import { UserService } from 'src/app/services/user.service';
import { BookingStatus } from 'src/app/utils/enums';
import iconURL from 'src/costants';

@Component({
  selector: 'app-accommodation-details',
  templateUrl: './accommodation-details.component.html',
  styleUrls: ['./accommodation-details.component.css']
})
export class AccommodationDetailsComponent implements OnInit, OnDestroy {

  userId?: number;

  //A User ID was not provided:
  userNotLogged: boolean = false;

  //Is the provided User ID lecit?
  //invalidUserId: boolean = true;

  accommodation!: Accommodation;
  invalidAccommodation: boolean = false;
  isFavourite: boolean = false;
  isAdminOrMe: boolean = false;

  accommodationUnavailabilities: string[] = [];

  accommodationReviews: Review[] = [];
  filteredAccommodationReviews: Review[] = [];
  accommodationReviewsPageNumber: number = 0;
  accommodationReviewsTotalPagesNumber!: number;
  errorAcceptingReview: boolean = false;
  errorRejectingReview: boolean = false;
  successAcceptingReview: boolean = false;
  successRejectingReview: boolean = false;

  accommodationOwner!: User;

  showDeleteAccommodationConfirmPopup: boolean = false;

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


  iconUrl = iconURL;
  locale: string = 'en';
  localeSubscription?: Subscription;

  //Child Communication:
  chosenAvailability?: Availability;
  queryParams?: Params;

  //Coordinates:
  coordinates?: Coordinates;

  constructor(
    private accommodationService: AccommodationService,
    private userService: UserService,
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private translateService: TranslateService,
    private draftService: DraftService,
    private router: Router
  ) 
  {}

  //IMPORTANT NOTE: check that the Accommodation has both main photo url in accommodation table
  //AND associated photos in the photo table
  ngOnInit(): void {
    this.localeSubscription = this.translateService.onLangChange.subscribe(
      event => this.locale = event.lang.slice(0,2));
    
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
          this.selectedServices.push(s);

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
            
            //this.invalidUserId = false;

            let tmp1: Boolean | undefined;
            let tmp2: Boolean | undefined;
            let tmp3: any;
            let tmp4: Boolean | undefined;console.log("INFO -> ", info);
            let tmp5: any;

            if(!("isAdmin" in info) || !("isOwner" in info) || !("reviews" in info) || !("isFavourite" in info) || !("pendingByUserOrAcceptedOrDoingBookings" in info)
              || ((tmp1 = Boolean(info["isAdmin"])) == undefined) || ((tmp2 = Boolean(info["isOwner"])) == undefined)
              || !(tmp3 = info["reviews"]) || ((tmp4 = Boolean(info["isFavourite"])) == undefined)
              || !(tmp5 = info["pendingByUserOrAcceptedOrDoingBookings"])) {

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
                this.accommodationReviews.push(r);
              } 
            }
            
            console.log("Reviews -> ", this.accommodationReviews);

            //Filtro le review in base al tipo di User loggato:
            if(!this.isAdminOrMe) this.accommodationReviews = this.accommodationReviews.filter(r => r.approval_timestamp != null);

            //Ordino le Review per ID discendente (in questo modo avrò per prime le accommodation più recenti):
            this.accommodationReviews.sort((s1, s2) => s2.id! - s1.id!);

            //Adesso ottengo le review in base al numero di pagina:
            this.filteredAccommodationReviews = this.getDesiredReviewsByPageNumber(this.accommodationReviewsPageNumber, this.accommodationReviews);

            //Ora calcolo il numero di pagine:
            this.accommodationReviewsTotalPagesNumber = Math.ceil(this.accommodationReviews.length / 4);

            //Now lets insert values into the unavailabilities Map:
            let tmp: BookingDTO[] = [];
            let tempBooking: BookingDTO;

            //Aggiungo i valori alla lista "tmp":
            for (let v of tmp5) {
              tempBooking = {
                check_in: v.checkIn,
                check_out: v.checkOut,
                price: 0,
                status: "",
                accommodation: {id: this.accommodation.id!,
                  title: this.accommodation.title,
                  city: this.accommodation.city!,
                  main_photo_url: this.accommodation.main_photo_url,
                  country: this.accommodation.country,
                  province: this.accommodation.province!,
                  min_price: 0,
                  max_price: 0,
                  is_favourite: false,
                  rating: 0}
                };

              tmp.push(tempBooking);
            }
            console.log("STAMPO TMP -> ", tmp);

            let inDateN: number;
            let outDateN: number;

            let date: Date;

            let monthName: string;
            let year: number;
            let day: number;

            let cursor: number;

            for (let b of tmp) {
              inDateN = Date.parse(b.check_in);
              outDateN = Date.parse(b.check_out);

              cursor = inDateN;

              while (cursor <= outDateN) {
                date = new Date(cursor);

                monthName = this.getMonthName(date.getMonth());
                year = date.getFullYear();
                day = date.getDate();

                if(!this.accommodationUnavailabilities.includes(year + "-" + monthName + "-" + day))
                this.accommodationUnavailabilities.push(
                  year + "-" + monthName + "-" + day
                );

                cursor = new Date(
                  year,
                  date.getMonth(),
                  day + 1
                ).getTime();
              }
            }

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
                else {console.log("found user -> ", foundUser);
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

  ngOnDestroy(): void {
    if(this.localeSubscription)
      this.localeSubscription.unsubscribe();
  }
  
  private getMonthName(monthIndexLocal: number): string {
    switch(monthIndexLocal) {
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

  receiveAvailabilityFromChild($event: Availability | {message: string}) {
    if($event && !("message" in $event)) {
      this.chosenAvailability = $event;

      if($event.start_date != "" && $event.end_date != "") {
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
    }
    else {
      if($event && 'message' in $event) this.message = $event.message;
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

  toggleDeleteAccommodation(): void {
    this.showDeleteAccommodationConfirmPopup = !this.showDeleteAccommodationConfirmPopup;
  }

  deleteAccommodation() {
    this.toggleDeleteAccommodation();

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
            setTimeout(() => this.router.navigate(["/"]), 1850)
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

    this.setCoordinates(this.accommodation);
    if(this.errorOccurred) return;

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

  async setCoordinates(accommodation: Accommodation) {
    const coordinates = await this.draftService.getCoordinates((accommodation.street ?? '') + ', ' + (accommodation.street_number ?? '') + ', ' + (accommodation.city ?? '') + ', ' + (accommodation.cap ?? '') + ', ' + (accommodation.province ?? '') + ', ' + (accommodation.country ?? ''));
    console.log(coordinates);
    if(coordinates && accommodation.id) {
    this.accommodationService.setCoordinates(accommodation.id, coordinates);
    this.coordinates = coordinates;
    } else {
      this.message = "true";
      this.errorOccurred = true;
    }
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

    let booking: Booking = {
      accommodation: this.accommodation, 
      timestamp: (new Date()).toLocaleDateString(), 
      price: this.postOperation$.value, 
      status: BookingStatus.PENDING, 
      check_in: this.chosenAvailability?.start_date!, 
      check_out: this.chosenAvailability?.end_date!, 
      is_unavailability: false, 
      user_id: this.userId!
    };

    let container: {chosen_availability: Availability,
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

  //PageSize === 4
  getDesiredReviewsByPageNumber(pageNumber: number, reviews: Review[]): Review[] {
    let reviewPages: Map<Number, Review[]> = this.buildPagesMap(pageNumber, reviews);

    return reviewPages.get(pageNumber)!;
  }

  //PageSize === 4
  private buildPagesMap(pageNumber: number, reviews: Review[]): Map<Number, Review[]> {
    let reviewPages: Map<Number, Review[]> = new Map<Number, Review[]>();

    let pageNumberIndex: number = 0;
    let tmp: number = 0;
    let counter: number = 0;

    while(pageNumberIndex <= pageNumber) {

      reviewPages.set(pageNumberIndex, []);

      counter = 0;
      while(counter < 4) {
        
        if(!reviews[tmp]) break;

        reviewPages.get(pageNumberIndex)?.push(reviews[tmp]);
        tmp++;
        counter++;
      }

      pageNumberIndex++;
    }

    return reviewPages;
  }

  //Prendo n elementi dalla lista delle review in base all' offset specificato
  //PageSize === 4
  consumeAskForPageEvent($event: number) {
    console.log($event, this.accommodationReviewsTotalPagesNumber);
    if($event < 0) return;
    if($event > this.accommodationReviewsTotalPagesNumber) return;
    console.log("eccomi");

    this.accommodationReviews.sort((a, b) => b.id! - a.id!);
    let map: Map<Number, Review[]> = this.buildPagesMap($event, this.accommodationReviews);
    console.log(map);

    this.accommodationReviewsPageNumber = $event;

    this.filteredAccommodationReviews = map.get($event)!;
  }

  //this.reviewChange.emit({ id: this.review.id, action: 'reject' });
  //this.reviewChange.emit({ id: this.review.id, action: 'accept' });
  consumeReviewActionEvent($event: { id:number, action:string }) {
    let action: string = $event.action;
    let rId: number = $event.id;

    if(action === "reject") {
      this.reviewService.rejectReview(rId).subscribe(
        result => {
          this.message = "true";
          if(!result) this.errorRejectingReview = true;
          else {
            this.successRejectingReview = true;
            this.accommodationReviews = this.accommodationReviews.filter(r => r.id !== rId);
            this.accommodationReviewsTotalPagesNumber = Math.ceil(this.accommodationReviews.length / 4);
            this.accommodationReviewsPageNumber = 0;
            this.filteredAccommodationReviews = this.getDesiredReviewsByPageNumber(this.accommodationReviewsPageNumber, this.accommodationReviews);
          }
        }
      )
    }
    else {
      this.reviewService.acceptReview(rId).subscribe(
        result => {
          this.message = "true";
          if(!result) this.errorAcceptingReview = true;
          else {
            this.successAcceptingReview = true;
            this.filteredAccommodationReviews.forEach(r => {
              if(r.id === rId) r.approval_timestamp = new Date(Date.now()).toISOString();
            })
          }
        }
      )
    }
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
    this.errorAcceptingReview = false;
    this.errorRejectingReview = false;
    this.successAcceptingReview = false;
    this.successRejectingReview = false;

  }

}
