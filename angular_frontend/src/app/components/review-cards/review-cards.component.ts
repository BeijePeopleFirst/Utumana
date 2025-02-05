import { Component, Input } from '@angular/core';
import { Review } from 'src/app/models/review';

@Component({
  selector: 'app-review-cards',
  templateUrl: './review-cards.component.html',
  styleUrls: ['./review-cards.component.css']
})
export class ReviewCardsComponent {
  @Input() reviews!: Review[];
  @Input() userName!: string;
}
