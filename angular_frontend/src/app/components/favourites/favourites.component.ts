import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  favourites$!: Observable<AccommodationDTO[]> ;
  favouritesPageSize!: number;
  favouritesPageNumber!: number;
  favouritesTotalPages!: number;

  constructor(
      private accommodationService: AccommodationService
    ){ }

  ngOnInit(): void {
    this.favourites$ = this.accommodationService.favourites$;
    this.favouritesPageSize = 8;
    this.favouritesPageNumber = 0;
    this.favouritesTotalPages = 2;
    this.loadFavouritesPage(0);
  }

  loadFavouritesPage(pageNumber: number): void {
    this.favouritesPageNumber = pageNumber;
    this.accommodationService.getFavourites(this.favouritesPageNumber * this.favouritesPageSize, this.favouritesPageSize);
  }
}
