import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AddressDTO } from 'src/app/dtos/addressDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';
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
  address: AddressDTO | null = null;

  constructor(
    private draftService: DraftService,
    private accommodationService: AccommodationService,
    private router: Router
  ) { }

  close(): void {
    this.closeModal.emit();
  }

  createAccommodation(): void {
    console.log("Creating accommodation...");
    this.error = false;
    this.draftService.getAddress(this.draftId).subscribe(address => {
      this.address = address;
    });
    this.draftService.publishDraft(this.draftId).subscribe({
      next: async (accommodationId: number) => {
        if(accommodationId > -1){
          this.router.navigate(['/accommodation', accommodationId]);
                const coordinates = await this.draftService.getCoordinates(this.address?.street + ', ' + this.address?.street_number + ', ' + this.address?.city + ', ' + this.address?.province + ', ' + this.address?.country)
                if(coordinates) {
                this.accommodationService.setCoordinates(accommodationId, coordinates)
                } else {
                  this.error = true;
                }
              }
        else{
          this.error = true;
        }
      },
      error: error => {
        console.error(error);
        this.error = true;
      }
    });
  }
}
