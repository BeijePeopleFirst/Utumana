import { Component, OnInit } from '@angular/core';
import { Review } from 'src/app/models/review';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ReviewService } from 'src/app/services/review.service';
import { UserService } from 'src/app/services/user.service';
import iconURL, { imagesURL } from 'src/costants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  id: number | undefined = Number(localStorage.getItem("id"));
  user!: User;
  iconsUrl: string = iconURL;
  pictureUrl!: string;
  defaultPictureUrl: string = `${imagesURL}\\users\\default_profile.png`;
  isEditBioModalOpen: boolean = false;

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

  selectedReviewId: number = -1;
  isReviewModalOpen: boolean = false;
  reviewModalAction: string = '';

  constructor(
    private userService: UserService,
    private reviewService: ReviewService
  ){}

  ngOnInit(): void {
    if(this.id){
      this.userService.getUserById(this.id).subscribe(res => {
        if('message' in res){
          return;
        }else{
          this.user = res;
          this.pictureUrl = `${imagesURL}\\users\\${this.user.id}\\profile.png`;

          this.loadUserReviews();    
        }
      })
    }
  }

  editPicture(): void {
    console.log("Editing profile picture");
  }



  loadUser(): void {
    if(this.id){
      this.userService.getUserById(this.id).subscribe(res => {
        if('message' in res){
          return;
        }else{
          this.user = res;
          this.pictureUrl = `${imagesURL}\\users\\${this.user.id}\\profile.png`; 
        }
      })
    }
  }

  loadUserReviews(): void {
    this.reviewsPageSize = 4;
    this.reviewsPageNumber = 0;
    this.waitingReviewsPageSize = 4;
    this.waitingReviewsPageNumber = 0;

    if(this.id){
      this.allReviews = [];
      this.allWaitingReviews = [];
      this.reviewService.getUserReviews(this.id).subscribe(reviews => {
        console.log(reviews);
        for(let i:number = 0; i < reviews.length; i++){
          reviews[i].approval_timestamp != null ? this.allReviews.push(reviews[i]) : this.allWaitingReviews.push(reviews[i]);
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


  closeReviewModal(refresh: boolean): void {
    this.selectedReviewId = -1;
    this.isReviewModalOpen = false;
    document.body.style.overflow = 'auto';
    if(refresh == true){
      this.loadUserReviews();
    }
  }

  showReviewModal(reviewId: number, action: string): void {
    if(action != 'accept' && action != 'reject'){
      console.log("Error: unknown action on review: ", action);
      return;
    }
    this.selectedReviewId = reviewId;
    this.isReviewModalOpen = true;
    this.reviewModalAction = action;
    document.body.style.overflow = 'hidden';
  }


  closeEditBioModal(refresh: boolean): void {
    this.isEditBioModalOpen = false;
    document.body.style.overflow = 'auto';
    if(refresh == true){
      this.loadUser();
    }
  }

  showEditBioModal(): void {
    this.isEditBioModalOpen = true;
    document.body.style.overflow = 'hidden';
  }
}
