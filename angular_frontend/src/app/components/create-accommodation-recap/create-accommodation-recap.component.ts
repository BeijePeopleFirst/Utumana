import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressDTO } from 'src/app/dtos/addressDTO';
import { GeneralAccommodationInfoDTO } from 'src/app/dtos/generalAccommodationInfoDTO';
import { UnavailabilityInterface } from 'src/app/dtos/unavailabilityDTO';
import { AvailabilityInterface } from 'src/app/models/availability';
import { Service } from 'src/app/models/service';
import { DraftService } from 'src/app/services/draft.service';

@Component({
  selector: 'app-create-accommodation-recap',
  templateUrl: './create-accommodation-recap.component.html',
  styleUrls: ['./create-accommodation-recap.component.css']
})
export class CreateAccommodationRecapComponent implements OnInit {
  draftId: number;
  genericError: boolean = false;

  address!: AddressDTO;
  services!: Service[];
  availabilities!: AvailabilityInterface[];
  unavailabilities!: UnavailabilityInterface[];
  info!: GeneralAccommodationInfoDTO;
  photos!: any[];

  isAddressOk: boolean = false;
  isInfoOk: boolean = false;
  arePhotosOk: boolean = false;

  isConfirmModalOpen: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private draftService: DraftService
  ) {
    this.draftId = this.route.snapshot.params['draftId'];
  }

  ngOnInit(): void {
    // load and check address
    // load services
    // load availabilities and unavailabilities
    // load and check info
    // load photos (?) and check that there is at least one photo
  }

  goBack(){
    this.router.navigate(['/create/photos/', this.draftId]);
  }

  showConfirmModal(){
    this.isConfirmModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeConfirmModal(){
    this.isConfirmModalOpen = false;
    document.body.style.overflow = 'auto';
  }
}
