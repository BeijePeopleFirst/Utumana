import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DraftService } from 'src/app/services/draft.service';

@Component({
  selector: 'app-create-accommodation-confirm-modal',
  templateUrl: './create-accommodation-confirm-modal.component.html',
  styleUrls: ['./create-accommodation-confirm-modal.component.css']
})
export class CreateAccommodationConfirmModalComponent {
  @Input() draftId!: number;
  @Input() isModalOpen!: boolean;
  @Output() closeModal = new EventEmitter<void>();
  error: boolean = false;

  constructor(
    private draftService: DraftService,
    private router: Router
  ) { }

  close(): void {
    this.closeModal.emit();
  }

  createAccommodation(): void {
    console.log("Creating accommodation...");
    this.error = false;
    // this.draftService.createAccommodation(this.draftId).subscribe({
    //   next: () => {
    //     this.router.navigate(['/create/success']);
    //   },
    //   error: error => {
    //     console.error(error);
    //     this.error = true;
    //   }
    // });
  }
}
