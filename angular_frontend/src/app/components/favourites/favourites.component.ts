import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  favourites$!: Observable<AccommodationDTO[]> ;
  allFavourites!: AccommodationDTO[];
  favouritesPageSize!: number;
  favouritesPageNumber!: number;
  favouritesTotalPages!: number;

  constructor(
      private accommodationService: AccommodationService
    ){ }

  ngOnInit(): void {
    this.favouritesPageSize = 4;
    this.favouritesPageNumber = 0;
    this.accommodationService.getFavourites().subscribe(favourites => {
      this.allFavourites = favourites;
      console.log("All fav", this.allFavourites);
      this.favouritesTotalPages = Math.ceil( favourites.length / this.favouritesPageSize );
      this.favourites$ = of(favourites.slice(0, this.favouritesPageSize));
    });
  }

  loadFavouritesPage(pageNumber: number): void {
    this.favouritesPageNumber = pageNumber;
    let offset = this.favouritesPageNumber * this.favouritesPageSize;
    this.favourites$ = of(this.allFavourites.slice(offset, offset + this.favouritesPageSize));
  }
}
