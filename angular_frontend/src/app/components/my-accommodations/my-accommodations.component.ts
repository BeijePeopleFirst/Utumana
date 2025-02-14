import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-my-accommodations',
  templateUrl: './my-accommodations.component.html',
  styleUrls: ['./my-accommodations.component.css']
})
export class MyAccommodationsComponent implements OnInit {
  accommodations$!: Observable<AccommodationDTO[]> ;
  allAccommodations!: AccommodationDTO[];
  accommodationsPageSize!: number;
  accommodationsPageNumber!: number;
  accommodationsTotalPages!: number;

  pendingAccommodations$!: Observable<AccommodationDTO[]> ;
  allPendingAccommodations!: AccommodationDTO[];
  pendingAccommodationsPageSize!: number;
  pendingAccommodationsPageNumber!: number;
  pendingAccommodationsTotalPages!: number;

  rejectedAccommodations$!: Observable<AccommodationDTO[]> ;
  allRejectedAccommodations!: AccommodationDTO[];
  rejectedAccommodationsPageSize!: number;
  rejectedAccommodationsPageNumber!: number;
  rejectedAccommodationsTotalPages!: number;

  constructor(
      private accommodationService: AccommodationService
    ){ }

  ngOnInit(): void {
    this.accommodationsPageSize = 4;
    this.accommodationsPageNumber = 0;
    this.accommodationService.getMyAccommodations().subscribe(accommodations => {
      this.accommodationsTotalPages = Math.ceil( accommodations.length / this.accommodationsPageSize );
      this.accommodationService.getPrices(accommodations).subscribe(updated => {
        this.allAccommodations = updated;
        this.accommodations$ = of(updated.slice(0, this.accommodationsPageSize));
      });
    });

    this.pendingAccommodationsPageSize = 4;
    this.pendingAccommodationsPageNumber = 0;
    this.accommodationService.getMyPendingAccommodations().subscribe(accommodations => {
      this.pendingAccommodationsTotalPages = Math.ceil( accommodations.length / this.pendingAccommodationsPageSize );
      this.accommodationService.getPrices(accommodations).subscribe(updated => {
        this.allPendingAccommodations = updated;
        this.pendingAccommodations$ = of(updated.slice(0, this.pendingAccommodationsPageSize));
      });
    });

    this.rejectedAccommodationsPageSize = 4;
    this.rejectedAccommodationsPageNumber = 0;
    this.accommodationService.getMyRejectedAccommodations().subscribe(accommodations => {
      this.rejectedAccommodationsTotalPages = Math.ceil( accommodations.length / this.rejectedAccommodationsPageSize );
      this.accommodationService.getPrices(accommodations).subscribe(updated => {
        this.allRejectedAccommodations = updated;
        this.rejectedAccommodations$ = of(updated.slice(0, this.rejectedAccommodationsPageSize));
      });
    });
  }

  loadAccommodationsPage(pageNumber: number): void {
    this.accommodationsPageNumber = pageNumber;
    let offset = this.accommodationsPageNumber * this.accommodationsPageSize;
    this.accommodations$ = of(this.allAccommodations.slice(offset, offset + this.accommodationsPageSize));
  }

  loadPendingAccommodationsPage(pageNumber: number): void {
    this.pendingAccommodationsPageNumber = pageNumber;
    let offset = this.pendingAccommodationsPageNumber * this.pendingAccommodationsPageSize;
    this.pendingAccommodations$ = of(this.allPendingAccommodations.slice(offset, offset + this.pendingAccommodationsPageSize));
  }

  loadRejectedAccommodationsPage(pageNumber: number): void {
    this.rejectedAccommodationsPageNumber = pageNumber;
    let offset = this.rejectedAccommodationsPageNumber * this.rejectedAccommodationsPageSize;
    this.rejectedAccommodations$ = of(this.allRejectedAccommodations.slice(offset, offset + this.rejectedAccommodationsPageSize));
  }
}
