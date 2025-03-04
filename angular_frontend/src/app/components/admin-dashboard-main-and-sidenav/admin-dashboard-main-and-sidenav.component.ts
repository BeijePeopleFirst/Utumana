import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard-main-and-sidenav',
  templateUrl: './admin-dashboard-main-and-sidenav.component.html',
  styleUrls: ['./admin-dashboard-main-and-sidenav.component.css']
})

export class AdminDashboardMainAndSidenavComponent {
  constructor() { }
  PREFIX_ADMIN = 'admin-dashboard';

  isAccommodationMenuOpen = false;
  isUsersMenuOpen = false;
  isMetricsMenuOpen = false;

  toggleAccommodationsMenu() {
    this.isAccommodationMenuOpen = !this.isAccommodationMenuOpen;
  }

  toggleUsersMenu() {
    this.isUsersMenuOpen = !this.isUsersMenuOpen;
  }

  toggleMetricsMenu() {
    this.isMetricsMenuOpen = !this.isMetricsMenuOpen;
  }

}
