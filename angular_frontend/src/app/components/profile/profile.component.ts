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
  reviews: Review[] = [];
  user!: User;

  constructor(
    private reviewService: ReviewService
  ){}

  ngOnInit(): void {
    // TODO get real user
    this.user = new User();
    this.user.name = "Name";
    
    this.loadUserReviews();
  }

  loadUserReviews(): void {
    if(this.id){
      this.reviewService.getUserReviews(this.id).subscribe(reviews => this.reviews = reviews);
    }
  }
}
