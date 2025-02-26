import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccommodationCardComponent } from './components/accommodation-card/accommodation-card.component';
import {HttpClientModule,HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/authInterceptor.service';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeEn from '@angular/common/locales/en'
registerLocaleData(localeIt);
registerLocaleData(localeEn);

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ReviewCardComponent } from './components/review-card/review-card.component';
import { ReviewCardsComponent } from './components/review-cards/review-cards.component';
import { AccommodationDetailsComponent } from './components/accommodation-details/accommodation-details.component';
import { BookingCardComponent } from './components/booking-card/booking-card.component';
import { BookingCardsComponent } from './components/booking-cards/booking-cards.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { MyAccommodationsComponent } from './components/my-accommodations/my-accommodations.component';
import { HostDashboardComponent } from './components/host-dashboard/host-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WriteReviewComponent } from './components/write-review/write-review.component';
import { BookConfirmComponent } from './components/book-confirm/book-confirm.component';
import { BookNowComponent } from './components/book-now/book-now.component';
import { CreateAccommodationAddressComponent } from './components/create-accommodation-address/create-accommodation-address.component';
import { CreateAccommodationServicesComponent } from './components/create-accommodation-services/create-accommodation-services.component';
import { CreateAccommodationInfoComponent } from './components/create-accommodation-info/create-accommodation-info.component';
import { CreateAccommodationPhotosComponent } from './components/create-accommodation-photos/create-accommodation-photos.component';
import { CreateAccommodationAvailabilityComponent } from './components/create-accommodation-availability/create-accommodation-availability.component';
import { CreateAccommodationRecapComponent } from './components/create-accommodation-recap/create-accommodation-recap.component';
import { AccommodationCardsComponent } from './components/accommodation-cards/accommodation-cards.component';
import { ChooseBookPeriodFromAccDetailsComponent } from './components/choose-book-period-from-acc-details/choose-book-period-from-acc-details.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { ConfirmBookingBooknowComponent } from './components/confirm-booking-booknow/confirm-booking-booknow.component';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { ReviewAcceptRejectModalComponent } from './components/review-accept-reject-modal/review-accept-reject-modal.component';
import { TimerComponent } from './components/timer/timer.component';
import { SearchAccommodationListComponent } from './components/search-accommodation-list/search-accommodation-list.component';
import { ProfileBioModalComponent } from './components/profile-bio-modal/profile-bio-modal.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SettingsPasswordModalComponent } from './components/settings-password-modal/settings-password-modal.component';
import { CreateProgressComponent } from './components/create-progress/create-progress.component';
import { MapComponent } from './components/map/map.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AccommodationCardComponent,
    LoginComponent,
    HomeComponent,
    SearchBarComponent,
    ReviewCardComponent,
    ReviewCardsComponent,
    AccommodationDetailsComponent,
    BookingCardComponent,
    BookingCardsComponent,
    MyBookingsComponent,
    MyAccommodationsComponent,
    HostDashboardComponent,
    ProfileComponent,
    WriteReviewComponent,
    BookConfirmComponent,
    BookNowComponent,
    CreateAccommodationAddressComponent,
    CreateAccommodationServicesComponent,
    CreateAccommodationInfoComponent,
    CreateAccommodationPhotosComponent,
    CreateAccommodationAvailabilityComponent,
    CreateAccommodationRecapComponent,
    AccommodationCardsComponent,
    ChooseBookPeriodFromAccDetailsComponent,
    SearchPageComponent,
    ConfirmBookingBooknowComponent,
    FilterModalComponent,
    FavouritesComponent,
    ReviewAcceptRejectModalComponent,
    TimerComponent,
    SearchAccommodationListComponent,
    ProfileBioModalComponent,
    SettingsComponent,
    SettingsPasswordModalComponent,
    CreateProgressComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide:TranslateLoader,
        useFactory:HttpLoaderFactory,
        deps:[HttpClient]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
