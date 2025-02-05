import { Component, Input } from '@angular/core';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-accommodation-cards',
  templateUrl: './accommodation-cards.component.html',
  styleUrls: ['./accommodation-cards.component.css']
})
export class AccommodationCardsComponent {
  @Input() accommodations:AccommodationDTO[] | null=null;

  test:number[]=[1,2,3,4,5,6];

  constructor(
      private accommodationService:AccommodationService
    ){ }
}
