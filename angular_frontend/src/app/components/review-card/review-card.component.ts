import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Review } from 'src/app/models/review';
import iconURL from 'src/costants';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent implements OnInit, OnDestroy {
  @Input() review!: Review;
  @Output() reviewChange = new EventEmitter<{id:number, action:string}>();
  iconsUrl: string = iconURL;
  locale: string = 'en';
  localeSubscription?: Subscription;
  expanded: boolean = false;

  constructor(
    private translateService: TranslateService
  ){ }

  ngOnInit(): void {
    this.localeSubscription = this.translateService.onLangChange.subscribe(
      event => this.locale = event.lang.slice(0,2));
  }

  ngOnDestroy(): void {
    if(this.localeSubscription)
      this.localeSubscription.unsubscribe();
  }

  acceptReview(): void {
    if(this.review.id){
      this.reviewChange.emit({ id: this.review.id, action: 'accept' });
    }
  }

  rejectReview(): void {
    if(this.review.id){
      this.reviewChange.emit({ id: this.review.id, action: 'reject' });
    }
  }
}
