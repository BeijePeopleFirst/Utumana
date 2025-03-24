import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { BookingService } from 'src/app/services/booking.service';
import { imagesURL } from 'src/costants';

@Component({
  selector: 'app-admin-dashboard-home-panel-component',
  templateUrl: './admin-dashboard-home-panel-component.component.html',
  styleUrls: ['./admin-dashboard-home-panel-component.component.css']
})
export class AdminDashboardHomePanelComponent implements OnInit {

  public totalAccommodations!: number;
  public displaySpinner: boolean = true;
  public totalDoingBookings!: number;
  
  constructor(
    private accommodationService: AccommodationService,
    private bookingService: BookingService,
    private router: Router
  )
  {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.accommodationService.getAccommodationsToBeApproved().subscribe(accommodations => {
      this.accommodationService.getPrices(accommodations).subscribe(updated => {
        this.totalAccommodations = updated.length;
        
        this.bookingService.getAllDoingBookings().subscribe(
          response => {
            this.totalDoingBookings = response.length;
            this.displaySpinner = false;
          }
        )
      });
    });
  }

  goToAcceptOrRejectAccommodations(): void {
    this.router.navigate(["/admin-dashboard/accommodations/accept-reject"]);
  }

  public goToMetrics(): void {
    this.router.navigate(["/admin-dashboard/metrics"]);
  }

}
