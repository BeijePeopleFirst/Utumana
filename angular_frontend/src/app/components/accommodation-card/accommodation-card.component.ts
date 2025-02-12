import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';
import iconURL from 'src/costants';

@Component({
  selector: 'app-accommodation-card',
  templateUrl: './accommodation-card.component.html',
  styleUrls: ['./accommodation-card.component.css']
})
export class AccommodationCardComponent implements OnInit {
  @Input() accommodation!: AccommodationDTO;
  priceRange: boolean = true;
  free: boolean = true;
  book: boolean = false;
  heartClick: boolean = false;
  iconsUrl: string = iconURL;

  constructor(
    private router: Router,
    private accommodationService: AccommodationService
  ){}

  ngOnInit(): void {
    this.priceRange = this.accommodation.max_price - this.accommodation.min_price > 0;
    this.free = !this.priceRange && this.accommodation.max_price < 0.01;
  }

  onClick(event: Event): void {
    event.stopImmediatePropagation();
    if(this.book){
      this.router.navigate(['book', this.accommodation.id]);
    }else if(this.heartClick){
      this.toggleFavourite();
      this.heartClick = false;
    }else{
      this.router.navigate(['accommodation', this.accommodation.id]);
    }
  }

  toggleFavourite(): void {
    console.log("Updating favourites");
    this.accommodation.is_favourite = !this.accommodation.is_favourite;
    if(this.accommodation.is_favourite){
      this.accommodationService.addFavouriteToCurrentUser(this.accommodation.id).subscribe(ok => {
        if(!ok){
          this.accommodation.is_favourite = !this.accommodation.is_favourite;
        }
      });
    }else{
      this.accommodationService.removeFavouriteFromCurrentUser(this.accommodation.id).subscribe(ok => {
        if(!ok){
          this.accommodation.is_favourite = !this.accommodation.is_favourite;
        }
      });
    }
  }
}
