import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { AuthService } from 'src/app/services/auth.service';
import iconURL from 'src/costants';

@Component({
  selector: 'app-accommodation-card',
  templateUrl: './accommodation-card.component.html',
  styleUrls: ['./accommodation-card.component.css']
})
export class AccommodationCardComponent implements OnInit {
  @Input() accommodation!: AccommodationDTO;
  priceRange: boolean = true;
  free: boolean = true;
  book: boolean = false;
  heartClick: boolean = false;
  iconsUrl: string = iconURL;
  isAdmin: boolean = false;
  @Input() status!: string;

  isAcceptRejectModalOpen: boolean = false;
  acceptRejectAction: string = '';
  @Output() refresh = new EventEmitter<void>();

  constructor(
    private router: Router,
    private accommodationService: AccommodationService,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.priceRange = this.accommodation.max_price - this.accommodation.min_price > 0;
    this.free = !this.priceRange && this.accommodation.max_price < 0.01;
    this.authService.isAdmin().subscribe(is_admin => {
      this.isAdmin = is_admin;
    });
  }

  onClick(event: Event): void {
    event.stopImmediatePropagation();
    if(this.book){
      this.router.navigate(['book', this.accommodation.id]);
    }else if(this.heartClick){
      this.toggleFavourite();
      this.heartClick = false;
    }else{
      this.router.navigate(['accommodation', this.accommodation.id]);
    }
  }

  toggleFavourite(): void {
    console.log("Updating favourites");
    this.accommodation.is_favourite = !this.accommodation.is_favourite;
    if(this.accommodation.is_favourite){
      this.accommodationService.addFavouriteToCurrentUser(this.accommodation.id).subscribe(ok => {
        if(!ok){
          this.accommodation.is_favourite = !this.accommodation.is_favourite;
        }
      });
    }else{
      this.accommodationService.removeFavouriteFromCurrentUser(this.accommodation.id).subscribe(ok => {
        if(!ok){
          this.accommodation.is_favourite = !this.accommodation.is_favourite;
        }
      });
    }
  }

  closeAcceptRejectModal(shouldRefresh: boolean): void {
    this.isAcceptRejectModalOpen = false;
    document.body.style.overflow = 'auto';
    if(shouldRefresh == true){
      this.status = this.acceptRejectAction == 'accept' ? 'accepted' : 'rejected';
      this.refresh.emit();
      //this.router.navigate(['/admin-dashboard/accommodations/accept-reject'])
    }
  }

  showAcceptRejectModal(event: Event, action: string): void {
    event.stopImmediatePropagation();
    if(action != 'accept' && action != 'reject'){
      console.log("Error: unknown action on accommodation: ", action);
      return;
    }
    this.isAcceptRejectModalOpen = true;
    this.acceptRejectAction = action;
    document.body.style.overflow = 'hidden';
  }
}
