import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { imagesURL } from 'src/costants';

@Component({
  selector: 'app-admin-dashboard-home-panel-component',
  templateUrl: './admin-dashboard-home-panel-component.component.html',
  styleUrls: ['./admin-dashboard-home-panel-component.component.css']
})
export class AdminDashboardHomePanelComponent implements OnInit {

  public totalAccommodations!: number;
  public displaySpinner: boolean = true;
  
  constructor(
    private accommodationService: AccommodationService,
    private router: Router
  )
  {}

  ngOnInit(): void {
    this.loadPendingAccommodations();
  }

  loadPendingAccommodations(): void {
      this.accommodationService.getAccommodationsToBeApproved().subscribe(accommodations => {
        this.accommodationService.getPrices(accommodations).subscribe(updated => {
          this.totalAccommodations = updated.length;
          this.displaySpinner = false
        });
      });
    }

  goToAcceptOrRejectAccommodations(): void {
    this.router.navigate(["/admin-dashboard/accommodations/accept-reject"]);
  }

}
