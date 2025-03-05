import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-admin-dashboard-accept-reject-modal',
  templateUrl: './admin-dashboard-accept-reject-modal.component.html',
  styleUrls: ['./admin-dashboard-accept-reject-modal.component.css']
})
export class AdminDashboardAcceptRejectModalComponent {
  @Input() accommodationId!: number;
  @Input() isModalOpen!: boolean;
  @Input() action!: string;
  @Output() closeModal = new EventEmitter<boolean>();
  error: boolean = false;

  constructor(private accommodationService: AccommodationService){}

  close(): void {
    this.closeModal.emit(false);
  }

  accept(): void {
    console.log("Accept accommodation " + this.accommodationId);
    this.error = false;
    this.accommodationService.approveAccommodation(this.accommodationId).subscribe({
      next: (acc) => {
        if(acc){
          this.closeModal.emit(true);
        }else{
          // show error message
          this.error = true;
        }
      },
      error: (err) => {
        console.error(err);
        this.error = true;
      }
    });
  }

  reject(): void {
    console.log("Reject accommodation " + this.accommodationId);
    this.error = false;
    this.accommodationService.rejectAccommodation(this.accommodationId).subscribe({
      next: (acc) => {
        if(acc){
          this.closeModal.emit(true);
        }else{
          // show error message
          this.error = true;
        }
      },
      error: (err) => {
        console.error(err);
        this.error = true;
      }
    });
  }
}
