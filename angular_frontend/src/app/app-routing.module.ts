import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccommodationCardComponent } from './components/accommodation-card/accommodation-card.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './services/auth.guard';
import { AccommodationDetailsComponent } from './components/accommodation-details/accommodation-details.component';
import { ReviewCardComponent } from './components/review-card/review-card.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateAccommodationAddressComponent } from './components/create-accommodation-address/create-accommodation-address.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { HostDashboardComponent } from './components/host-dashboard/host-dashboard.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { BookConfirmComponent } from './components/book-confirm/book-confirm.component';
import { ConfirmBookingBooknowComponent } from './components/confirm-booking-booknow/confirm-booking-booknow.component';
import { WriteReviewComponent } from './components/write-review/write-review.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { MyAccommodationsComponent } from './components/my-accommodations/my-accommodations.component';

const routes: Routes = [
  {path: 'login', title: "Login", component: LoginComponent},
  {path: '', title: "Utumana",  component: HomeComponent},
  {path: 'profile', title: "Profile", component: ProfileComponent},
  {path: 'favourites', title: "Favourites", component: FavouritesComponent},
  {path: 'create', title: "Create a new accommodation", component: CreateAccommodationAddressComponent},
  {path: 'my_bookings', title: "My Bookings", component: MyBookingsComponent},
  {path: 'my_accommodations', title: "My Accommodations", component: MyAccommodationsComponent},
  {path: 'host_dashboard', title: "Host Dashboard", component: HostDashboardComponent},
  {path: 'accommodation/:id', title: "Accommodation Details", component: AccommodationDetailsComponent},
  {path: 'search_page', title: "Search", component: SearchPageComponent},
  {path: 'book/:id', component: BookConfirmComponent},
  {path: 'confirm_booking_on_creation', component: ConfirmBookingBooknowComponent}
  // { path: '**', title: "Error", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
