import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit, OnDestroy {
  favourites$!: Observable<AccommodationDTO[]> ;
  favouritesPageSize!: number;
  favouritesPageNumber!: number;
  favouritesTotalPages!: number;
  subscriptions: Subscription = new Subscription();

  constructor(
      private accommodationService: AccommodationService
    ){ }

  ngOnInit(): void {
    this.favourites$ = this.accommodationService.favourites$;
    this.favouritesPageSize = 4;
    this.favouritesPageNumber = 0;
    this.subscriptions.add(
      this.accommodationService.favouritesTotalNumber.subscribe(
        number => this.favouritesTotalPages = Math.ceil(number/this.favouritesPageSize))
    );
    this.loadFavouritesPage(0);
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }

  loadFavouritesPage(pageNumber: number): void {
    this.favouritesPageNumber = pageNumber;
    this.accommodationService.getFavourites(this.favouritesPageNumber * this.favouritesPageSize, this.favouritesPageSize);
  }
}
