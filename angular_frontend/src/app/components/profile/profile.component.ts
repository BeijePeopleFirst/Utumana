import { Component, OnInit } from '@angular/core';
import { Review } from 'src/app/models/review';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  id: number | undefined = Number(localStorage.getItem("id"));
  user!: User;

  reviews: Review[] = [];
  reviewsPageSize!: number;
  reviewsPageNumber!: number;
  reviewsTotalPages!: number;
  allReviews: Review[] = [];

  waitingReviews: Review[] = [];
  waitingReviewsPageSize!: number;
  waitingReviewsPageNumber!: number;
  waitingReviewsTotalPages!: number;
  allWaitingReviews: Review[] = [];

  constructor(
    private reviewService: ReviewService
  ){}

  ngOnInit(): void {
    // TODO get real user
    this.user = new User();

    this.loadUserReviews();    
  }

  loadUserReviews(): void {
    this.reviewsPageSize = 4;
    this.reviewsPageNumber = 0;
    this.waitingReviewsPageSize = 4;
    this.waitingReviewsPageNumber = 0;

    if(this.id){
      this.reviewService.getUserReviews(this.id).subscribe(reviews => {
        for(let i:number = 0; i < reviews.length; i++){
          reviews[i].approval_timestamp != null ? this.allReviews.push(reviews[i]) : this.waitingReviews.push(reviews[i]);
        }
        this.reviewsTotalPages = Math.ceil(this.allReviews.length / this.reviewsPageSize);
        this.loadUserReviewsPage(0);
        this.waitingReviewsTotalPages = Math.ceil(this.allWaitingReviews.length / this.waitingReviewsPageSize);
        this.loadWaitingReviewsPage(0);
      });
    }
  }

  loadUserReviewsPage(pageNumber: number): void {
    let offset = pageNumber * this.reviewsPageSize;
    this.reviews = this.allReviews.slice(offset, offset + this.reviewsPageSize);
    this.reviews.forEach(review => { if(!review.author) review.author = 'User'; }); // TODO get real author
    this.reviewsPageNumber = pageNumber;
  }

  loadWaitingReviewsPage(pageNumber: number): void {
    let offset = pageNumber * this.waitingReviewsPageSize;
    this.waitingReviews = this.allWaitingReviews.slice(offset, offset + this.waitingReviewsPageSize);
    this.waitingReviews.forEach(review => { if(!review.author) review.author = 'User'; }); // TODO get real author
    this.waitingReviewsPageNumber = pageNumber;
  }
}
