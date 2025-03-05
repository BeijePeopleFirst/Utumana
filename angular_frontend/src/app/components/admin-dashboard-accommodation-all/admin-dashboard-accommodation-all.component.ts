import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';

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

  private accommodationsCache = new Map<number, AccommodationDTO[]>();

  isLoading = true;

  constructor(
      private accommodationService: AccommodationService,
      private route: ActivatedRoute,
      private router: Router
  ) {}

  ngOnInit(): void {
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

ngOnDestroy(): void {
  this.accommodationsCache.clear();
}
}
