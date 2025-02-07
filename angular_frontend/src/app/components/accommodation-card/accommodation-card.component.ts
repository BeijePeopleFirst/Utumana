import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { Accommodation } from 'src/app/models/accommodation';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private router: Router){}

  ngOnInit(): void {
    console.log(this.accommodation);
    this.priceRange = this.accommodation.max_price - this.accommodation.min_price > 0;
    this.free = !this.priceRange && this.accommodation.max_price < 0.01;
  }

  onClick(event: Event): void {
    event.stopImmediatePropagation();
    if(this.book){
      this.router.navigate(['book', this.accommodation.id]);
    }else{
      this.router.navigate(['accommodation', this.accommodation.id]);
    }
  }
}
