import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccommodationCardComponent } from './components/accommodation-card/accommodation-card.component';
import {HttpClientModule,HttpClient} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
import { ReactiveFormsModule } from '@angular/forms';

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
    AccommodationCardsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide:TranslateLoader,
        useFactory:HttpLoaderFactory,
        deps:[HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
