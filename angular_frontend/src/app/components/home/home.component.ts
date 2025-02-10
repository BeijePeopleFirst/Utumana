import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { iconURL } from 'src/costants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  iconUrl = iconURL;

  latestUploads$!: Observable<AccommodationDTO[]> ;
  latestUploadsPageSize!: number;
  latestUploadsPageNumber!: number;
  latestUploadsTotalPages!: number;

  mostLiked$!: Observable<AccommodationDTO[]> ;
  mostLikedPageSize!: number;
  mostLikedPageNumber!: number;
  mostLikedTotalPages!: number;

  constructor(
    private accommodationService:AccommodationService
  ){ }
  
  ngOnInit(): void {
    this.latestUploads$ = this.accommodationService.latestAccommodations$;
    this.latestUploadsPageSize = 4;
    this.latestUploadsPageNumber = 0;
    this.latestUploadsTotalPages = 2; // latest accommodation pages that the user can look at
    this.loadLatestAccommodationsPage(0);

    this.mostLiked$ = this.accommodationService.mostLikedAccommodations$;
    this.mostLikedPageSize = 4;
    this.mostLikedPageNumber = 0;
    this.mostLikedTotalPages = 2; // most liked accommodation pages that the user can look at
    this.loadMostLikedAccommodationsPage(0);
  }

  loadLatestAccommodationsPage(pageNumber: number): void {
    this.latestUploadsPageNumber = pageNumber;
    this.accommodationService.getLatestUploads(this.latestUploadsPageNumber * this.latestUploadsPageSize, this.latestUploadsPageSize);
  }

  loadMostLikedAccommodationsPage(pageNumber: number): void {
    this.mostLikedPageNumber = pageNumber;
    this.accommodationService.getMostLikedAccommodations(this.mostLikedPageNumber * this.mostLikedPageSize, this.mostLikedPageSize);
  }
}
