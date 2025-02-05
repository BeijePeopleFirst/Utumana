import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Review } from 'src/app/models/review';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent implements OnInit{
  review: Review | undefined;
  id: number | undefined;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService
  ){ }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.getReview();
  }

  getReview(): void {
    if(!this.id){
      this.review = undefined;
      this.error = true;
      return;
    }
  }
}
