import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { Review } from 'src/app/models/review';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.css']
})
export class WriteReviewComponent {
  @Input() isModalOpen = false;
  @Input() bookingId!:number;
  @Output() closeModal = new EventEmitter<void>();
  @Output() reviewAdded = new EventEmitter<void>();

  reviewForm: FormGroup;
  stars = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder,private reviewService:ReviewService) {
    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      comfort: [1, Validators.required],
      position: [1, Validators.required],
      convenience: [1, Validators.required],
      description: ['', Validators.required]
    });
  }

  submitReview() {
    if (this.reviewForm.valid) {
      const review: Review = {
        title: this.reviewForm.value.title,
        position: this.reviewForm.value.position,
        convenience: this.reviewForm.value.convenience,
        comfort: this.reviewForm.value.comfort,
        description: this.reviewForm.value.description,
        overall_rating:0,
        id:null,
        approval_timestamp:null,
        booking_id : this.bookingId
      };

      this.reviewService.addReview(review).subscribe({
        next: () => {
          console.log('Review Submitted:', this.reviewForm.value);
          this.close();
          this.reviewAdded.emit();
          alert('Review Submitted Successfully!');
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          alert(error.message || 'An error occurred while submitting the review.');
          this.close();
        },
        complete: () => {
          console.log('Review submission completed.');
        }
      });
    }
  }

  setComfort(star: number) {
    this.reviewForm.patchValue({ comfort: star });
    console.log(star);
  }

  setPosition(star: number) {
    this.reviewForm.patchValue({ position: star });
  }

  setConvenience(star: number) {
    this.reviewForm.patchValue({ convenience: star });
  }
  
  close() {
    this.closeModal.emit(); 
  }
}
