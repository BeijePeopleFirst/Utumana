import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { DraftService } from 'src/app/services/draft.service';

@Component({
  selector: 'app-my-accommodations',
  templateUrl: './my-accommodations.component.html',
  styleUrls: ['./my-accommodations.component.css']
})
export class MyAccommodationsComponent implements OnInit {
  accommodations$!: Observable<AccommodationDTO[]> ;
  allAccommodations!: AccommodationDTO[];
  accommodationsPageSize!: number;
  accommodationsPageNumber!: number;
  accommodationsTotalPages!: number;

  pendingAccommodations$!: Observable<AccommodationDTO[]> ;
  allPendingAccommodations!: AccommodationDTO[];
  pendingAccommodationsPageSize!: number;
  pendingAccommodationsPageNumber!: number;
  pendingAccommodationsTotalPages!: number;

  rejectedAccommodations$!: Observable<AccommodationDTO[]> ;
  allRejectedAccommodations!: AccommodationDTO[];
  rejectedAccommodationsPageSize!: number;
  rejectedAccommodationsPageNumber!: number;
  rejectedAccommodationsTotalPages!: number;

  myDrafts$!: Observable<AccommodationDTO[]> ;
  allMyDrafts!: AccommodationDTO[];
  myDraftsPageSize!: number;
  myDraftsPageNumber!: number;
  myDraftsTotalPages!: number;

  draftBeingDragged: AccommodationDTO | null = null;
  showDeleteModal = false;
  draftToDelete: AccommodationDTO | null = null;

  ownerId: number;

  constructor(
      private accommodationService: AccommodationService,
      private draftService: DraftService
    ){
      this.ownerId = this.draftService.getOwnerId();
  }

  ngOnInit(): void {
    this.accommodationsPageSize = 4;
    this.accommodationsPageNumber = 0;
    this.accommodationService.getMyAccommodations().subscribe(accommodations => {
      this.accommodationsTotalPages = Math.ceil( accommodations.length / this.accommodationsPageSize );
      this.accommodationService.getPrices(accommodations).subscribe(updated => {
        this.allAccommodations = updated;
        this.accommodations$ = of(updated.slice(0, this.accommodationsPageSize));
      });
    });

    this.pendingAccommodationsPageSize = 4;
    this.pendingAccommodationsPageNumber = 0;
    this.accommodationService.getMyPendingAccommodations().subscribe(accommodations => {
      this.pendingAccommodationsTotalPages = Math.ceil( accommodations.length / this.pendingAccommodationsPageSize );
      this.accommodationService.getPrices(accommodations).subscribe(updated => {
        this.allPendingAccommodations = updated;
        this.pendingAccommodations$ = of(updated.slice(0, this.pendingAccommodationsPageSize));
      });
    });

    this.rejectedAccommodationsPageSize = 4;
    this.rejectedAccommodationsPageNumber = 0;
    this.accommodationService.getMyRejectedAccommodations().subscribe(accommodations => {
      this.rejectedAccommodationsTotalPages = Math.ceil( accommodations.length / this.rejectedAccommodationsPageSize );
      this.accommodationService.getPrices(accommodations).subscribe(updated => {
        this.allRejectedAccommodations = updated;
        this.rejectedAccommodations$ = of(updated.slice(0, this.rejectedAccommodationsPageSize));
      });
    });

    this.myDraftsPageSize = 4;
    this.myDraftsPageNumber = 0;
    this.draftService.getDraftsByOwnerId(this.ownerId).subscribe(accommodations => {
      this.myDraftsTotalPages = Math.ceil( accommodations.length / this.myDraftsPageSize );
      this.allMyDrafts = accommodations;
      this.myDrafts$ = of(accommodations.slice(0, this.myDraftsPageSize));
    });
  }

  loadAccommodationsPage(pageNumber: number): void {
    this.accommodationsPageNumber = pageNumber;
    let offset = this.accommodationsPageNumber * this.accommodationsPageSize;
    this.accommodations$ = of(this.allAccommodations.slice(offset, offset + this.accommodationsPageSize));
  }

  loadPendingAccommodationsPage(pageNumber: number): void {
    this.pendingAccommodationsPageNumber = pageNumber;
    let offset = this.pendingAccommodationsPageNumber * this.pendingAccommodationsPageSize;
    this.pendingAccommodations$ = of(this.allPendingAccommodations.slice(offset, offset + this.pendingAccommodationsPageSize));
  }

  loadRejectedAccommodationsPage(pageNumber: number): void {
    this.rejectedAccommodationsPageNumber = pageNumber;
    let offset = this.rejectedAccommodationsPageNumber * this.rejectedAccommodationsPageSize;
    this.rejectedAccommodations$ = of(this.allRejectedAccommodations.slice(offset, offset + this.rejectedAccommodationsPageSize));
  }

  loadMyDraftsPage(pageNumber: number): void {
    this.myDraftsPageNumber = pageNumber;
    let offset = this.myDraftsPageNumber * this.myDraftsPageSize;
    this.myDrafts$ = of(this.allMyDrafts.slice(offset, offset + this.myDraftsPageSize));
  }

  onDraftDragStart(event: {draft: AccommodationDTO, event: Event}): void {
    this.draftBeingDragged = event.draft;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();

    if(event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDraftDrop(event: DragEvent): void {
    event.preventDefault();
    if(this.draftBeingDragged) {
      this.draftToDelete = this.draftBeingDragged;
      this.showDeleteModal = true;
      this.draftBeingDragged = null;
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.draftToDelete = null;
  }

  confirmDelete(): void {
    if(this.draftToDelete) {
      const draftId = this.draftToDelete.id;

      this.accommodationService.deleteDraft(draftId).subscribe({
        next: () => {
          this.allMyDrafts = this.allMyDrafts.filter(draft => draft.id !== draftId);
          this.showDeleteModal = false;
          this.loadMyDraftsPage(this.myDraftsPageNumber);
        },
        error: () => {
          console.error("Error deleting draft");
        }
      });

      this.showDeleteModal = false;
      this.draftToDelete = null;
    }
  }
}
