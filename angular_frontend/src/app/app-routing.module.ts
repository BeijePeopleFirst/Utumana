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

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: HomeComponent},
  {path: 'review/:id', component: ReviewCardComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'create', component: CreateAccommodationAddressComponent},
  {path: 'my_bookings', component: MyBookingsComponent},
  {path: 'host_dashboard', component: HostDashboardComponent},
  {path: 'accommodation/:id', component: AccommodationDetailsComponent},
  {path: 'search_page', component: SearchPageComponent},
  {path: 'book/:id', component: BookConfirmComponent}
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
