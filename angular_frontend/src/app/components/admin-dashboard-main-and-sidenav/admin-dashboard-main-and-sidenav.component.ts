import { Component, HostListener } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-main-and-sidenav',
  templateUrl: './admin-dashboard-main-and-sidenav.component.html',
  styleUrls: ['./admin-dashboard-main-and-sidenav.component.css']
})

export class AdminDashboardMainAndSidenavComponent {
  PREFIX_ADMIN = 'admin-dashboard';

  isAccommodationMenuOpen = false;
  isUsersMenuOpen = false;
  isMetricsMenuOpen = false;
  isSidenavOpen = true;

  screenWidth!: number;
  screenHeight!: number;

  constructor(private router: Router){
    this.closeSidenavIfSmallScreen();

    router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.closeSidenavIfSmallScreen();
        }
      }
    )
  }

  @HostListener('window:resize', ['$event'])
  closeSidenavIfSmallScreen(event?: Event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth < 1024) { // screen smaller than lg:
      this.isSidenavOpen = false;
    }
  }

  toggleAccommodationsMenu() {
    this.isAccommodationMenuOpen = !this.isAccommodationMenuOpen;
  }

  toggleUsersMenu() {
    this.isUsersMenuOpen = !this.isUsersMenuOpen;
  }

  toggleMetricsMenu() {
    this.isMetricsMenuOpen = !this.isMetricsMenuOpen;
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
