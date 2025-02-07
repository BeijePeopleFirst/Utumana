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
  reviewsOffset!: number;
  reviewsPageSize!: number;

  reviewsPage: Review[] = []; //  ONLY TEMPORARY: REMOVE WHEN GET REVIEWS IS PAGINATED

  constructor(
    private reviewService: ReviewService
  ){}

  ngOnInit(): void {
    // TODO get real user
    this.user = new User();
    this.user.name = "Name";
    
    this.reviewsOffset = 0;
    this.reviewsPageSize = 3;
    this.loadUserReviews();
  }

  loadUserReviews(): void {
    if(this.id){
      this.reviewService.getUserReviews(this.id, this.reviewsOffset, this.reviewsPageSize).subscribe(reviews => {
        this.reviews = reviews;
        this.reviewsPage = reviews.slice(this.reviewsOffset, this.reviewsOffset + this.reviewsPageSize);
        console.log(reviews, this.reviewsPage);
      });
    }
  }
}
