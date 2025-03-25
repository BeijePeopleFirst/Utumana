import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { PopularOperationTitle } from 'src/app/models/popularOperation';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard-accept-reject',
  templateUrl: './admin-dashboard-accept-reject.component.html',
  styleUrls: ['./admin-dashboard-accept-reject.component.css']
})
export class AdminDashboardAcceptRejectComponent implements OnInit{
  pendingAccommodations$!: Observable<AccommodationDTO[]>;
  allPendingAccommodations!: AccommodationDTO[];
  pendingAccommodationsPageNumber = 1;
  pendingAccommodationsPageSize = 5;
  pendingAccommodationsTotalPages = 1;
  
  isLoading = true;

  constructor(
    private accommodationService: AccommodationService,
    private userService: UserService
  ) 
  {}

  ngOnInit() {
    this.userService.setUserLatestOperationPerformedAsAdmin(Number(localStorage.getItem("id")), PopularOperationTitle.APPROVE_REJECT_ACCOMMODATIONS).subscribe();
    this.pendingAccommodationsPageSize = 3;
    this.pendingAccommodationsPageNumber = 0;
    this.loadPendingAccommodations();
  }

  loadPendingAccommodations(): void {
    this.accommodationService.getAccommodationsToBeApproved().subscribe(accommodations => {
      this.pendingAccommodationsTotalPages = Math.ceil( accommodations.length / this.pendingAccommodationsPageSize );
      this.accommodationService.getPrices(accommodations).subscribe(updated => {
        this.allPendingAccommodations = updated;
        this.pendingAccommodations$ = of(updated.slice(this.pendingAccommodationsPageNumber * this.pendingAccommodationsPageSize, this.pendingAccommodationsPageSize));
        this.isLoading = false;
      });
    });
  }

  refresh(pageNumber: number): void {
    this.pendingAccommodationsPageNumber = pageNumber;
    this.loadPendingAccommodations();
  }

  loadPendingAccommodationsPage(pageNumber: number): void {
    this.pendingAccommodationsPageNumber = pageNumber;
    let offset = this.pendingAccommodationsPageNumber * this.pendingAccommodationsPageSize;
    this.pendingAccommodations$ = of(this.allPendingAccommodations.slice(offset, offset + this.pendingAccommodationsPageSize));
  }

}
