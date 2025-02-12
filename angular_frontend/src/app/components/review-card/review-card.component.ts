import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Review } from 'src/app/models/review';
import { ReviewService } from 'src/app/services/review.service';
import iconURL from 'src/costants';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent implements OnInit, OnDestroy {
  @Input() review!: Review;
  @Output() reviewChange = new EventEmitter<void>();
  iconsUrl: string = iconURL;
  locale: string = 'en';
  localeSubscription?: Subscription;
  expanded: boolean = false;

  constructor(
    private translateService: TranslateService,
    private reviewService: ReviewService
  ){ }

  ngOnInit(): void {
    this.localeSubscription = this.translateService.onLangChange.subscribe(event => this.locale = event.lang.slice(0,2));
  }

  ngOnDestroy(): void {
    if(this.localeSubscription)
      this.localeSubscription.unsubscribe();
  }

  acceptReview(): void {
    if(this.review.id){
      console.log("Accept review " + this.review.id);
      this.reviewService.acceptReview(this.review.id).subscribe(ok => {
        if(ok === true){
          this.reviewChange.emit();
        }else{
          // show error message
        }
      });
    }
  }

  rejectReview(): void {
    if(this.review.id){
      console.log("Reject review " + this.review.id);
      this.reviewService.rejectReview(this.review.id).subscribe(ok => {
        if(ok === true){
          this.reviewChange.emit();
        }else{
          // show error message
        }
      });
    }
  }
}
