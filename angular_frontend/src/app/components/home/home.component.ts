import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
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
export class HomeComponent implements OnInit, OnDestroy {
  iconUrl = iconURL;

  latestUploads$!: Observable<AccommodationDTO[]> ;
  latestUploadsPageSize!: number;
  latestUploadsPageNumber!: number;
  latestUploadsTotalPages!: number;

  mostLiked$!: Observable<AccommodationDTO[]> ;
  mostLikedPageSize!: number;
  mostLikedPageNumber!: number;
  mostLikedTotalPages!: number;

  subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private accommodationService:AccommodationService,
    private searchService: SearchService
  ){ }
  
  ngOnInit(): void {
    this.latestUploads$ = this.accommodationService.latestAccommodations$;
    this.latestUploadsPageSize = 4;
    this.latestUploadsPageNumber = 0;
    this.subscriptions.add(
      this.accommodationService.latestAccommodationsTotalNumber.subscribe(
        number => this.latestUploadsTotalPages = Math.ceil(number/this.latestUploadsPageSize))
    );
    this.loadLatestAccommodationsPage(0);

    this.mostLiked$ = this.accommodationService.mostLikedAccommodations$;
    this.mostLikedPageSize = 4;
    this.mostLikedPageNumber = 0;
    this.subscriptions.add(
      this.accommodationService.mostLikedAccommodationsTotalNumber.subscribe(
        number => this.mostLikedTotalPages = Math.ceil(number/this.mostLikedPageSize))
    );
    this.loadMostLikedAccommodationsPage(0);
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }

  loadLatestAccommodationsPage(pageNumber: number): void {
    this.latestUploadsPageNumber = pageNumber;
    this.accommodationService.getLatestUploads(this.latestUploadsPageNumber * this.latestUploadsPageSize, this.latestUploadsPageSize);
  }

  loadMostLikedAccommodationsPage(pageNumber: number): void {
    this.mostLikedPageNumber = pageNumber;
    this.accommodationService.getMostLikedAccommodations(this.mostLikedPageNumber * this.mostLikedPageSize, this.mostLikedPageSize);
  }

  search(params: params) {
    this.searchService.setSearchData(params);
    this.router.navigate(['/search_page/'], { queryParams: params });
  }
}
