import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';

@Component({
  selector: 'app-search-accommodation-list',
  templateUrl: './search-accommodation-list.component.html',
  styleUrls: ['./search-accommodation-list.component.css']
})
export class SearchAccommodationListComponent {
    @Input() accommodations$!: Observable<AccommodationDTO[] | null>; 
    @Input() pageNumber!: number;
    @Input() totalPages!: number;
    @Input() status!: string;
    @Output() askForPage = new EventEmitter<number>();
  
    constructor( ){ }
  
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
