import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { params } from 'src/app/models/searchParams';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { SearchService } from 'src/app/services/search.service';
import { iconURL } from 'src/costants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  iconUrl = iconURL;

  latestUploads$!: Observable<AccommodationDTO[]>;
  allLatestUploads!: AccommodationDTO[];
  latestUploadsPageSize!: number;
  latestUploadsPageNumber!: number;
  latestUploadsTotalPages!: number;

  mostLiked$!: Observable<AccommodationDTO[]>;
  allMostLiked!: AccommodationDTO[];
  mostLikedPageSize!: number;
  mostLikedPageNumber!: number;
  mostLikedTotalPages!: number;

  constructor(
    private router: Router,
    private accommodationService:AccommodationService,
    private searchService: SearchService
  ){ }
  
  ngOnInit(): void {
    this.latestUploadsPageSize = 4;
    this.latestUploadsPageNumber = 0;
    this.accommodationService.getLatestUploads().subscribe(accommodations => {
      this.latestUploadsTotalPages = Math.ceil( accommodations.length / this.latestUploadsPageSize );
      this.accommodationService.getPrices(accommodations).subscribe(updatedAccommodations => {
        this.allLatestUploads = updatedAccommodations;
        this.latestUploads$ = of(updatedAccommodations.slice(0, this.latestUploadsPageSize));
      });
    });

    this.mostLikedPageSize = 4;
    this.mostLikedPageNumber = 0;
    this.accommodationService.getMostLikedAccommodations().subscribe(accommodations => {
      this.mostLikedTotalPages = Math.ceil( accommodations.length / this.mostLikedPageSize );
      this.accommodationService.getPrices(accommodations).subscribe(updatedAccommodations => {
        this.allMostLiked = updatedAccommodations;
        this.mostLiked$ = of(updatedAccommodations.slice(0, this.mostLikedPageSize));
      });
    });
  }

  loadLatestAccommodationsPage(pageNumber: number): void {
    this.latestUploadsPageNumber = pageNumber;
    const offset = this.latestUploadsPageNumber * this.latestUploadsPageSize;
    this.latestUploads$ = of(this.allLatestUploads.slice(offset, offset + this.latestUploadsPageSize));
  }

  loadMostLikedAccommodationsPage(pageNumber: number): void {
    this.mostLikedPageNumber = pageNumber;
    const offset = this.mostLikedPageNumber * this.mostLikedPageSize;
    this.mostLiked$ = of(this.allMostLiked.slice(offset, offset + this.mostLikedPageSize));
  }

  search(params: params) {
    this.searchService.setSearchData(params);
    this.router.navigate(['/search_page/'], { queryParams: params });
  }
}
