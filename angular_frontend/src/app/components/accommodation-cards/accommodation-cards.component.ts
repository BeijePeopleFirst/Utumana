import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-accommodation-cards',
  templateUrl: './accommodation-cards.component.html',
  styleUrls: ['./accommodation-cards.component.css']
})
export class AccommodationCardsComponent{
  @Input() accommodations$!: Observable<AccommodationDTO[] | null>; 
  //@Input() accommodations!: AccommodationDTO[]; // one page of accommodations
  @Input() pageNumber!: number;
  @Input() pageNumbers!: number;
  @Output() askForPage = new EventEmitter<number>();

  constructor( ){ }

/*    ngOnInit(){
    this.accommodationService.accommodations$.subscribe({
      next: (accommodations: AccommodationDTO[] | null) => {this.accommodations$ = accommodations || []},
      error: (error) => {console.error(error) }
    })
  } */

    prevPage(): void {
      this.getPage(this.pageNumber - 1);
    }
  
    nextPage(): void {
      this.getPage(this.pageNumber + 1);
    }
  
    getPage(n: number) {
      if(this.pageNumber != n){
        this.askForPage.emit(n);
      }
    }
}