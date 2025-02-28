import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';

@Component({
  selector: 'app-draft-cards',
  templateUrl: './draft-cards.component.html',
  styleUrls: ['./draft-cards.component.css']
})
export class DraftCardsComponent {
  @Input() accommodations$!: Observable<AccommodationDTO[] | null>; 
  @Input() pageNumber!: number;
  @Input() totalPages!: number;
  @Input() draggable: boolean = false;
  @Output() askForPage = new EventEmitter<number>();
  @Output() dragStart = new EventEmitter<{draft: AccommodationDTO, event: DragEvent}>();

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

  onDragStart(draft: AccommodationDTO, event: DragEvent): void {
    if(this.draggable) {
      this.dragStart.emit({draft, event});
    }
  }
}
