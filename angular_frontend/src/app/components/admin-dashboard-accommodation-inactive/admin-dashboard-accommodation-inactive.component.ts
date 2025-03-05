import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-admin-dashboard-accommodation-inactive',
  templateUrl: './admin-dashboard-accommodation-inactive.component.html',
  styleUrls: ['./admin-dashboard-accommodation-inactive.component.css']
})
export class AdminDashboardAccommodationInactiveComponent {
    inactiveAccommodations$!: Observable<AccommodationDTO[]>;
    allInactiveAccommodations!: AccommodationDTO[];
    inactiveAccommodationsPageNumber: number = 0;
    inactiveAccommodationsPageSize: number = 6;
    inactiveAccommodationsTotalPages: number = 0;

    private inactiveAccommodationsCache = new Map<number, AccommodationDTO[]>();

    isLoading = true;

    constructor(
        private accommodationService: AccommodationService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.inactiveAccommodationsPageNumber = params['page'] ? +params['page'] : 0;
            this.inactiveAccommodationsPageSize = params['size'] ? +params['size'] : 6;
            this.fetchInactiveAccommodations();
        });
    }

    private fetchInactiveAccommodations(): void {
        if(this.inactiveAccommodationsCache.has(this.inactiveAccommodationsPageNumber)) {
            this.allInactiveAccommodations = this.inactiveAccommodationsCache.get(this.inactiveAccommodationsPageNumber)!;
            this.inactiveAccommodations$ = of(this.allInactiveAccommodations);
            this.isLoading = false;
            return;
        }
      this.isLoading = true;
      this.accommodationService.getInactiveAccommodations(
          this.inactiveAccommodationsPageNumber, 
          this.inactiveAccommodationsPageSize
      ).subscribe({
          next: (accommodations) => {
              if(accommodations.content.length === 0 && this.inactiveAccommodationsPageNumber > 1) {
                  this.loadInactiveAccommodationsPage(0); 
                  return;
              }

              this.inactiveAccommodationsPageNumber = accommodations.number; 
              this.inactiveAccommodationsPageSize = accommodations.size;
              this.inactiveAccommodationsTotalPages = accommodations.totalPages;

              this.accommodationService.getPrices(accommodations.content).subscribe({
                  next: (updated) => {
                      this.allInactiveAccommodations = updated;
                      this.inactiveAccommodations$ = of(updated);
                      this.inactiveAccommodationsCache.set(this.inactiveAccommodationsPageNumber, updated);
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

    loadInactiveAccommodationsPage(pageNumber: number): void {
      this.isLoading = true;
      
      this.router.navigate(['/admin-dashboard/accommodations/inactive-ones'], { 
          queryParams: { 
              page: pageNumber, 
              size: this.inactiveAccommodationsPageSize 
          },
          replaceUrl: true 
      });
  }

  ngOnDestroy(): void {
      this.inactiveAccommodationsCache.clear();
  }
}
