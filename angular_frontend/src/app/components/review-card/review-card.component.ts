import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Review } from 'src/app/models/review';
import iconURL from 'src/costants';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent {
  @Input() review: Review | undefined;
  @Input() userName: string | undefined;
  userPictureUrl: string = iconURL + '\\profile.png';
  locale: string = 'en';
  localeSubscription?: Subscription;
  expanded: boolean = false;

  constructor(private translateService: TranslateService){ }

  ngOnInit(): void {
    this.localeSubscription = this.translateService.onLangChange.subscribe(event => this.locale = event.lang.slice(0,2));
  }

  ngOnDestroy(): void {
    if(this.localeSubscription)
      this.localeSubscription.unsubscribe();
  }
}
