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

  reviewsAll: Review[] = []; //  ONLY TEMPORARY: REMOVE WHEN GET REVIEWS IS PAGINATED

  constructor(
    private reviewService: ReviewService
  ){}

  ngOnInit(): void {
    // TODO get real user
    this.user = new User();
    
    this.reviewsPageSize = 4;
    this.reviewsPageNumber = 0;

    this.loadUserReviews(); // to be substituted by this.loadUserReviewsPage(0);
  }

  loadUserReviews(): void {
    if(this.id){
      this.reviewService.getUserReviews(this.id, 0, this.reviewsPageSize).subscribe(reviews => {
        this.reviewsAll = reviews;        
        this.reviewsTotalPages = Math.ceil(this.reviewsAll.length / this.reviewsPageSize);
        console.log("Pages", this.reviewsTotalPages);
        this.loadUserReviewsPage(0);
      });
    }
  }

  // For now, get reviews page from reviewsAll. It should be changed to get reviews page from backend (reviewService.getUserReviews(...)...).
  loadUserReviewsPage(pageNumber: number): void {
    let offset = pageNumber * this.reviewsPageSize;
    this.reviews = this.reviewsAll.slice(offset, offset + this.reviewsPageSize);
    this.reviews.forEach(review => { if(!review.author) review.author = 'User'; });
    this.reviewsPageNumber = pageNumber;
  }
}
