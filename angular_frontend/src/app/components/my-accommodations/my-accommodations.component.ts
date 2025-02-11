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
  }

  loadAccommodationsPage(pageNumber: number): void {
    this.accommodationsPageNumber = pageNumber;
    let offset = this.accommodationsPageNumber * this.accommodationsPageSize;
    this.accommodations$ = of(this.allAccommodations.slice(offset, offset + this.accommodationsPageSize));
  }
}
