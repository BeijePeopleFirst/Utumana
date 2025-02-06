import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-accommodation-cards',
  templateUrl: './accommodation-cards.component.html',
  styleUrls: ['./accommodation-cards.component.css']
})
export class AccommodationCardsComponent implements OnInit {
  @Input() accommodations:AccommodationDTO[] | null=null;
  accommodations$!: Observable<AccommodationDTO[] | null>;
  
  constructor(
      private accommodationService:AccommodationService
    ){ }

   ngOnInit(){
    this.accommodations$ = this.accommodationService.getSearchResults();  
  }
}