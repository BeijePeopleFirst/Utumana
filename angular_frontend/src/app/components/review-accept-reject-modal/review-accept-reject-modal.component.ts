import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-review-accept-reject-modal',
  templateUrl: './review-accept-reject-modal.component.html',
  styleUrls: ['./review-accept-reject-modal.component.css']
})
export class ReviewAcceptRejectModalComponent {
  @Input() reviewId!: number;
  @Input() isModalOpen!: boolean;
  @Input() action!: string;
  @Output() closeModal = new EventEmitter<boolean>();
  error: boolean = false;

  constructor(private reviewService: ReviewService){}

  close(): void {
    this.closeModal.emit(false);
  }

  accept(): void {
    console.log("Accept review " + this.reviewId);
    this.error = false;
    this.reviewService.acceptReview(this.reviewId).subscribe(ok => {
      if(ok === true){
        this.closeModal.emit(true);
      }else{
        // show error message
        this.error = true;
      }
    });
  }

  reject(): void {
    console.log("Reject review " + this.reviewId);
    this.error = false;
    this.reviewService.rejectReview(this.reviewId).subscribe(ok => {
      if(ok === true){
        this.closeModal.emit(true);
      }else{
        // show error message
        this.error = true;
      }
    });
  }
}
