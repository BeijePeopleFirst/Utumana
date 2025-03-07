import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-admin-dashboard-accommodation-active',
  templateUrl: './admin-dashboard-accommodation-active.component.html',
  styleUrls: ['./admin-dashboard-accommodation-active.component.css']
})
export class AdminDashboardAccommodationActiveComponent implements OnInit {
    activeAccommodations$!: Observable<AccommodationDTO[]>;
    allActiveAccommodations!: AccommodationDTO[];
    activeAccommodationsPageNumber: number = 0;
    activeAccommodationsPageSize: number = 6;
    activeAccommodationsTotalPages: number = 0;

    private accommodationsCache = new Map<number, AccommodationDTO[]>();

    isLoading = true;

    constructor(
        private accommodationService: AccommodationService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.activeAccommodationsPageNumber = params['page'] ? +params['page'] : 0;
            this.activeAccommodationsPageSize = params['size'] ? +params['size'] : 6;
            this.fetchActiveAccommodations();
        });
    }

    private fetchActiveAccommodations(): void {
        if (this.accommodationsCache.has(this.activeAccommodationsPageNumber)) {
            this.allActiveAccommodations = this.accommodationsCache.get(this.activeAccommodationsPageNumber)!;
            this.activeAccommodations$ = of(this.allActiveAccommodations);
            this.isLoading = false;
            return;
        }
      this.isLoading = true;
      this.accommodationService.getActiveAccommodations(
          this.activeAccommodationsPageNumber, 
          this.activeAccommodationsPageSize
      ).subscribe({
          next: (accommodations) => {
              if(accommodations.content.length === 0 && this.activeAccommodationsPageNumber > 1) {
                  this.loadActiveAccommodationsPage(0); 
                  return;
              }

              this.activeAccommodationsPageNumber = accommodations.number; 
              this.activeAccommodationsPageSize = accommodations.size;
              this.activeAccommodationsTotalPages = accommodations.totalPages;

              this.accommodationService.getPrices(accommodations.content).subscribe({
                  next: (updated) => {
                      this.allActiveAccommodations = updated;
                      this.activeAccommodations$ = of(updated);
                      this.accommodationsCache.set(this.activeAccommodationsPageNumber, updated);
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

    loadActiveAccommodationsPage(pageNumber: number): void {
      this.isLoading = true;
      
      this.router.navigate(['/admin-dashboard/accommodations/active-ones'], { 
          queryParams: { 
              page: pageNumber, 
              size: this.activeAccommodationsPageSize 
          },
          replaceUrl: true 
      });
  }

  ngOnDestroy(): void {
      this.accommodationsCache.clear();
  }
}