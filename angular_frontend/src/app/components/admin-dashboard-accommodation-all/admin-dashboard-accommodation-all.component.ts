import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AdminSearchParams } from 'src/app/models/adminSearchParams';
import { PageResponse } from 'src/app/models/paginatedResponse';
import { PopularOperationTitle } from 'src/app/models/popularOperation';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { AdminDashboardSearchService } from 'src/app/services/admin-dashboard-search.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard-accommodation-all',
  templateUrl: './admin-dashboard-accommodation-all.component.html',
  styleUrls: ['./admin-dashboard-accommodation-all.component.css']
})
export class AdminDashboardAccommodationAllComponent {
  allAccommodations$!: Observable<AccommodationDTO[]>;
  allAccommodations!: AccommodationDTO[];
  allAccommodationsPageNumber: number = 0;
  allAccommodationsPageSize: number = 6;
  allAccommodationsTotalPages: number = 0;

  isSearchBarVisible: boolean = false;

  private accommodationsCache = new Map<number, AccommodationDTO[]>();

  isLoading = true;

  constructor(
      private accommodationService: AccommodationService,
      private userService: UserService,
      private route: ActivatedRoute,
      private router: Router,
      private adminDashboardSearchService: AdminDashboardSearchService
  ) {}

  ngOnInit(): void {
      this.userService.setUserLatestOperationPerformedAsAdmin(Number(localStorage.getItem("id")), PopularOperationTitle.ALL_ACCOMMODATIONS).subscribe();
      this.userService.updateUserOperationsCount(Number(localStorage.getItem("id")), PopularOperationTitle.ALL_ACCOMMODATIONS).subscribe();
      this.route.queryParams.subscribe(params => {
          this.allAccommodationsPageNumber = params['page'] ? +params['page'] : 0;
          this.allAccommodationsPageSize = params['size'] ? +params['size'] : 6;
          this.fetchAllAccommodations();
      });
  }

  private fetchAllAccommodations(): void {
    if (this.accommodationsCache.has(this.allAccommodationsPageNumber)) {
      this.allAccommodations = this.accommodationsCache.get(this.allAccommodationsPageNumber)!;
      this.allAccommodations$ = of(this.allAccommodations);
      this.isLoading = false;
      return;
  }

    this.isLoading = true;
    this.accommodationService.getAllAccommodations(
        this.allAccommodationsPageNumber, 
        this.allAccommodationsPageSize
    ).subscribe({
        next: (accommodations) => {
            if(accommodations.content.length === 0 && this.allAccommodationsPageNumber > 1) {
                this.loadAllAccommodationsPage(0); 
                return;
            }

            this.allAccommodationsPageNumber = accommodations.number; 
            this.allAccommodationsPageSize = accommodations.size;
            this.allAccommodationsTotalPages = accommodations.totalPages;

            this.accommodationService.getPrices(accommodations.content).subscribe({
                next: (updated) => {
                    this.allAccommodations = updated;
                    this.allAccommodations$ = of(updated);
                    this.accommodationsCache.set(this.allAccommodationsPageNumber, updated);
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
        },
        error: () => {
            this.isLoading = false;
        }
    });
}

  loadAllAccommodationsPage(pageNumber: number): void {
    this.isLoading = true;
    
    this.router.navigate(['/admin-dashboard/accommodations/all-accommodations'], { 
        queryParams: { 
            page: pageNumber, 
            size: this.allAccommodationsPageSize 
        },
        replaceUrl: true 
    });
}

toggleSearchBar(): void {
    this.isSearchBarVisible = !this.isSearchBarVisible;
  }

search(params: AdminSearchParams) {
    this.isLoading = true;
    this.adminDashboardSearchService.search(params).subscribe({
        next: (foundAccommodations: PageResponse<AccommodationDTO>) => {
            if(foundAccommodations) {
                this.allAccommodations = foundAccommodations.content;
                this.allAccommodations$ = of(foundAccommodations.content);
                this.allAccommodationsPageNumber = foundAccommodations.number;
                this.allAccommodationsPageSize = foundAccommodations.size;
                this.allAccommodationsTotalPages = foundAccommodations.totalPages;
                this.accommodationsCache.set(this.allAccommodationsPageNumber, this.allAccommodations);
                this.isLoading = false;
            }
        },
        error: () => {
            this.isLoading = false;
        }
    });
}

ngOnDestroy(): void {
  this.accommodationsCache.clear();
}
}
