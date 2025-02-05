import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Review } from 'src/app/models/review';
import { ReviewService } from 'src/app/services/review.service';
import iconURL from 'src/costants';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent {
  @Input() review: Review | undefined;
  @Input() userName: string | undefined;
  iconsUrl: string = iconURL;
}
