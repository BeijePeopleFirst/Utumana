import { Component, Input, OnInit } from '@angular/core';
import { Review } from 'src/app/models/review';

@Component({
  selector: 'app-review-cards',
  templateUrl: './review-cards.component.html',
  styleUrls: ['./review-cards.component.css']
})
export class ReviewCardsComponent implements OnInit {
  @Input() reviews!: Review[];  // one page of reviews
  reviewsSlice!: Review[];
  @Input() userName!: string;
  @Input() pageSize!: number;
  @Input() offset!: number;
  endIndex!: number;

  ngOnInit(): void {
      /*if(!this.pageSize){
        this.pageSize = 3;
      }
      if(!this.offset){
        this.offset = 0;
      }
      this.endIndex = this.offset + this.pageSize;
      if(this.endIndex > this.reviews.length){
        this.endIndex = this.reviews.length;
      }
      console.log(this.offset, this.endIndex); */
  }
}
