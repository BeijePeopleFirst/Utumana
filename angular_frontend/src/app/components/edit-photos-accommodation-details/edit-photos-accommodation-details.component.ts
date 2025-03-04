import { Component, Input, OnInit } from '@angular/core';
import { Accommodation } from 'src/app/models/accommodation';
import { Photo } from 'src/app/models/photo';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { S3Service } from 'src/app/services/s3.service';

@Component({
  selector: 'app-edit-photos-accommodation-details',
  templateUrl: './edit-photos-accommodation-details.component.html',
  styleUrls: ['./edit-photos-accommodation-details.component.css']
})
export class EditPhotosAccommodationDetailsComponent implements OnInit {
  
  @Input() accomodation!: Accommodation;

  photosCouples: [Photo, (Photo | null), (Photo | null)][] = [];

  //Messagges:
  //----------------------------------------------------
  public messages: boolean = false;
  public errorWhileSelectingFiles: boolean = false;
  public errorWhileUploadingToS3: boolean = false;
  //----------------------------------------------------


  constructor(
    private accommodationService: AccommodationService,
    private s3Service: S3Service
  )
  {}

  ngOnInit(): void {
    let i: number = 0;

    while(i < this.accomodation.photos.length) {
      if(i < this.accomodation.photos.length - 2) {
        this.photosCouples.push([this.accomodation.photos[i], this.accomodation.photos[i+1], this.accomodation.photos[i+2]]);
        i += 3;
        continue;
      }
      else {
        if(i < this.accomodation.photos.length - 1) {
          this.photosCouples.push([this.accomodation.photos[i], this.accomodation.photos[i+1], null]);
          break;
        }
        else {
          this.photosCouples.push([this.accomodation.photos[i], null, null]);
          break;
        }
      }
    }
  }

  //TODO:
  public removePhoto(id?: number): void {

  }

  //TODO:
  public uploadPhotosToS3($event: Event): void {
    const PHOTOS: HTMLInputElement = $event.target as HTMLInputElement;

    if(!PHOTOS.files || PHOTOS.files.length <= 0) {
      this.messages = true;
      this.errorWhileSelectingFiles = true;
      return;
    }

    let single: File | null;
    let formData: FormData;
    for(let i = 0; i < PHOTOS.files.length; i++) {
      single = PHOTOS.files.item(i);

      if(!single) {
        this.messages = true;
        this.errorWhileUploadingToS3 = true;
        return;
      }

      formData = new FormData();
      formData.append("photo", single);

      this.accommodationService.uploadPhoto(this.accomodation.id!, Number(localStorage.getItem("id")!), formData).subscribe(
        response => {
          if("message" in response) {
            console.error(response);
            this.messages = true;
            this.errorWhileUploadingToS3 = true;
            return;
          }
          else {

            //TODO
            //Recupero la foto e la metto nella lista photosCouples
            this.s3Service.getPhoto(response.photo_url).subscribe(
              photo => {
                if(!photo) {
                  this.errorWhileUploadingToS3 = true;
                  this.messages = true;
                  return;
                }

                let tmp: Photo = {id: 0, photo_url: response.photo_url, photo_order: response.photo_order, blob_url: URL.createObjectURL(photo)};

                this.photosCouples = this.addPhotoToViewList(tmp, this.photosCouples);
              }
            )

          }

        }
      )
    }
  }

  addPhotoToViewList(p: Photo, list: [Photo, (Photo | null), (Photo | null)][]): [Photo, (Photo | null), (Photo | null)][] {
    if(list.length === 0) {
      list.push([p, null, null]);
      return list;
    }

    let last: [Photo, (Photo | null), (Photo | null)] = list.pop()!;
    
    if(last[0] && last[1] && last[2]) {
      list.push(last);
      list.push([p, null, null]);
      return list;
    }
    else if(last[0] && last[1] && !last[2]) {
      last[2] = p;
      list.push(last);
      return list;
    }
    else if(last[0] && !last[1] && !last[2]) {
      last[1] = p;
      list.push(last);
      return list;
    }
    else{}

    return list;
  }

  //TODO:
  public confirmPhotos(): void {

  }

  clearMessages(): void {
    this.messages = false;
    this.errorWhileSelectingFiles = false;
    this.errorWhileUploadingToS3 = false;
  }

}
