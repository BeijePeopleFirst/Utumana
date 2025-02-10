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
  latestUploads!: AccommodationDTO[];
  latestUploadsPageSize!: number;
  latestUploadsPageNumber!: number;
  latestUploadsTotalPages!: number;
  allLatestUploads$!: Observable<AccommodationDTO[]>;  //  ONLY TEMPORARY: REMOVE WHEN GET LATEST UPLOADS IS PAGINATED
  getLatestUploadsPage!: Subscription;

  mostLiked:  AccommodationDTO[] | null=null;

  constructor(
    private router: Router,
    private accommodationService:AccommodationService
  ){ }
  
  ngOnInit(): void {
    this.latestUploads$ = this.accommodationService.accommodations$;
    this.latestUploadsPageSize = 4;
    this.latestUploadsPageNumber = 0;
    this.latestUploadsTotalPages = 2; // latest accommodation pages that the user can look at
    this.accommodationService.accommodations$.subscribe(accommodations => {
        console.log("Accommodations", accommodations);
        console.log("Total pages", this.latestUploadsTotalPages);
    });
    this.loadLatestAccommodationsPage(0);
  }

  loadLatestAccommodationsPage(pageNumber: number): void {
    this.latestUploadsPageNumber = pageNumber;
    this.accommodationService.getLatestUploads(this.latestUploadsPageNumber * this.latestUploadsPageSize, this.latestUploadsPageSize);
  }
}
