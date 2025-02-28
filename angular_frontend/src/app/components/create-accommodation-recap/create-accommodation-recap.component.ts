import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AddressDTO } from 'src/app/dtos/addressDTO';
import { GeneralAccommodationInfoDTO } from 'src/app/dtos/generalAccommodationInfoDTO';
import { UnavailabilityInterface } from 'src/app/dtos/unavailabilityDTO';
import { AvailabilityInterface } from 'src/app/models/availability';
import { Photo } from 'src/app/models/photo';
import { Service } from 'src/app/models/service';
import { DraftService } from 'src/app/services/draft.service';
import iconURL, { s3Prefix } from 'src/costants';

@Component({
  selector: 'app-create-accommodation-recap',
  templateUrl: './create-accommodation-recap.component.html',
  styleUrls: ['./create-accommodation-recap.component.css']
})
export class CreateAccommodationRecapComponent implements OnInit, OnDestroy {
  draftId: number;
  genericError: boolean = false;
  iconUrl: string = iconURL;

  address!: AddressDTO;
  services!: Service[];
  availabilities!: AvailabilityInterface[];
  unavailabilities!: UnavailabilityInterface[];
  info!: GeneralAccommodationInfoDTO;
  photoPreviews!: Photo[];

  isAddressComplete: boolean = false;
  isAddressValid: boolean = true;
  isInfoComplete: boolean = false;
  isInfoValid: boolean = true;
  arePhotosOk: boolean = false;

  isConfirmModalOpen: boolean = false;
  
  locale: string = 'en';
  localeSubscription?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private draftService: DraftService,
    private translateService: TranslateService
  ) {
    this.draftId = this.route.snapshot.params['draftId'];
  }

  ngOnInit(): void {
    this.localeSubscription = this.translateService.onLangChange.subscribe(
      event => this.locale = event.lang.slice(0,2));

    this.loadAndCheckAddress();
    this.loadServices();
    this.loadAvailabilitiesAndUnavailabilities();
    this.loadAndCheckInfo();
    this.loadAndCheckPhotos();
  }

  ngOnDestroy(): void {
    if(this.localeSubscription)
      this.localeSubscription.unsubscribe();
  }

  loadAndCheckAddress(){
    this.draftService.getAddress(this.draftId).subscribe(address => {
      if(!address){
        this.genericError = true;
        return;
      }
      this.address = address;

      this.isAddressComplete = true;
      this.isAddressValid = true;
      if(!address.cap || !address.country){
        this.isAddressComplete = false;
      } else if(/^[0-9]+$/.test(address.cap) === false || /^[a-zA-Z ,]+$/.test(address.country) === false){
        this.isAddressValid = false;
      }
    });
  }

  loadServices(){
    this.draftService.getServices(this.draftId).subscribe(services => {
      if(services == null){
        this.genericError = true;
        return;
      }
      this.services = services;
    });
  }

  loadAvailabilitiesAndUnavailabilities(){
    this.draftService.getAvailabilities(this.draftId).subscribe(availabilities => {
      if(!availabilities){
        this.genericError = true;
        return;
      }
      this.availabilities = availabilities;
    });

    this.draftService.getUnavailabilities(this.draftId).subscribe(unavailabilities => {
      if(!unavailabilities){
        this.genericError = true;
        return;
      }
      this.unavailabilities = unavailabilities;
    })
  }

  loadAndCheckInfo(){
    this.draftService.getAccommodationInfo(this.draftId).subscribe(info => {
      if(!info){
        this.genericError = true;
        return;
      }
      this.info = info;
      
      this.isInfoComplete = true;
      this.isInfoValid = true;
      if(!info.title || info.title.trim() == '' || !info.beds || !info.rooms){
        this.isInfoComplete = false;
      }else if(info.beds <=0 || info.rooms < 0){
        this.isInfoValid = false;
      }
    })
  }

  loadAndCheckPhotos(){
    this.draftService.getPhotos(this.draftId).subscribe(photos => {
      if(!photos) {
        this.genericError = true;
        return;
      }
      console.log("Photos on init:", photos);
      this.photoPreviews = [];
      for(let photo of photos){
        this.draftService.getPhoto(photo.photo_url).subscribe(blob => {
          if(blob == null){
            this.genericError = true;
            return;
          }
          photo.blob_url = URL.createObjectURL(blob);
          this.photoPreviews.push(photo);
        })
      }

      this.arePhotosOk = true;
      if(photos.length == 0){
        this.arePhotosOk = false;
      }
    });
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