import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './services/auth.guard';
import { AccommodationDetailsComponent } from './components/accommodation-details/accommodation-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateAccommodationAddressComponent } from './components/create-accommodation-address/create-accommodation-address.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { HostDashboardComponent } from './components/host-dashboard/host-dashboard.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { BookConfirmComponent } from './components/book-confirm/book-confirm.component';
import { ConfirmBookingBooknowComponent } from './components/confirm-booking-booknow/confirm-booking-booknow.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { MyAccommodationsComponent } from './components/my-accommodations/my-accommodations.component';
import { LoadSearchAccommodationResolver } from './resolvers/load-search-accommodation.resolver';
import { CreateAccommodationServicesComponent } from './components/create-accommodation-services/create-accommodation-services.component';
import { CreateAccommodationAvailabilityComponent } from './components/create-accommodation-availability/create-accommodation-availability.component';
import { CreateAccommodationInfoComponent } from './components/create-accommodation-info/create-accommodation-info.component';
import { CreateAccommodationPhotosComponent } from './components/create-accommodation-photos/create-accommodation-photos.component';
import { CreateAccommodationRecapComponent } from './components/create-accommodation-recap/create-accommodation-recap.component';

const routes: Routes = [
  {path: 'login', title: "Login", component: LoginComponent},
  {path: 'create', title: "Create a new accommodation", component: CreateAccommodationAddressComponent},
  {path: 'search_page', title: "Search", component: SearchPageComponent, resolve: {loadSearchAccommodations: LoadSearchAccommodationResolver}, runGuardsAndResolvers: 'always'},
  {path: '', title: "Utumana",  component: HomeComponent, canActivate: [authGuard]},
  {path: 'profile', title: "Profile", component: ProfileComponent, canActivate: [authGuard]},
  {path: 'favourites', title: "Favourites", component: FavouritesComponent, canActivate: [authGuard]},
  {path: 'create/address', title: "Create a new accommodation", component: CreateAccommodationAddressComponent, canActivate: [authGuard]},
  {path: 'create/services', title: "Create a new accommodation", component: CreateAccommodationServicesComponent, canActivate: [authGuard]},
  {path: 'create/availabilities', title: "Create a new accommodation", component: CreateAccommodationAvailabilityComponent, canActivate: [authGuard]},
  {path: 'create/info', title: "Create a new accommodation", component: CreateAccommodationInfoComponent, canActivate: [authGuard]},
  {path: 'create/photos', title: "Create a new accommodation", component: CreateAccommodationPhotosComponent, canActivate: [authGuard]},
  {path: 'create/confirm', title: "Create a new accommodation", component: CreateAccommodationRecapComponent, canActivate: [authGuard]},
  {path: 'my_bookings', title: "My Bookings", component: MyBookingsComponent, canActivate: [authGuard]},
  {path: 'my_accommodations', title: "My Accommodations", component: MyAccommodationsComponent, canActivate: [authGuard]},
  {path: 'host_dashboard', title: "Host Dashboard", component: HostDashboardComponent, canActivate: [authGuard]},
  {path: 'accommodation/:id', title: "Accommodation Details", component: AccommodationDetailsComponent, canActivate: [authGuard]},
  {path: 'book/:id', component: BookConfirmComponent, canActivate: [authGuard]},
  {path: 'confirm_booking_on_creation', component: ConfirmBookingBooknowComponent, canActivate: [authGuard]}
  // { path: '**', title: "Error", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
