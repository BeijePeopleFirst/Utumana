import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Review } from 'src/app/models/review';

@Component({
  selector: 'app-review-cards',
  templateUrl: './review-cards.component.html',
  styleUrls: ['./review-cards.component.css']
})
export class ReviewCardsComponent {
  @Input() reviews!: Review[];  // one page of reviews
  @Input() pageNumber!: number;
  @Input() totalPages!: number;
  @Input() showAccommodationLinks!: boolean;
  @Output() askForPage = new EventEmitter<number>();
  @Output() reviewAction = new EventEmitter<{ id:number, action:string }>();

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

  propagateReviewChange($event: { id:number, action:string }): void {
    this.reviewAction.emit($event);
  }
}
