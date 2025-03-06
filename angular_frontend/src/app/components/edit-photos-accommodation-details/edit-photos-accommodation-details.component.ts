import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output() notConfirmedPhotosIDsEvent: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() closeThisWindowEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  photosRows: [Photo, (Photo | null), (Photo | null)][] = [];

  private notConfirmedPhotosIDs: number[] = [];

  //Messagges:
  //----------------------------------------------------
  public messages: boolean = false;
  public errorWhileSelectingFiles: boolean = false;
  public errorWhileUploadingToS3: boolean = false;
  public errorRemovingPhoto: boolean = false;
  public successPhotoRemoved: boolean = false;
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
        this.photosRows.push([this.accomodation.photos[i], this.accomodation.photos[i+1], this.accomodation.photos[i+2]]);
        i += 3;
        continue;
      }
      else {
        if(i < this.accomodation.photos.length - 1) {
          this.photosRows.push([this.accomodation.photos[i], this.accomodation.photos[i+1], null]);
          break;
        }
        else {
          this.photosRows.push([this.accomodation.photos[i], null, null]);
          break;
        }
      }
    }
  }

  public removePhoto(id?: number): void {
    if(!id) {
      this.errorRemovingPhoto = true;
      this.messages = true;
      return;
    }

    this.accommodationService.removePhotosFromAccommodation(this.accomodation.id!, Number(localStorage.getItem("id")!),
                                                              Array.of(id))
            .subscribe(

              response => {
                if(typeof response != "boolean") {
                  this.errorRemovingPhoto = true;
                  this.messages = true;
                  console.error(response);
                  return;
                }

                //Adesso rimuovo la foto dalla lista di photosCouples:
                this.photosRows = this.removePhotoFromRows(id, this.photosRows);

                this.messages = true;
                this.successPhotoRemoved = true;
              }
              
            )
  }

  private removePhotoFromRows(id: number, l: [Photo, (Photo | null), (Photo | null)][]): [Photo, (Photo | null), (Photo | null)][] {
    let result: [Photo, (Photo | null), (Photo | null)][] = [];
    let support: Photo[] = [];

    l.forEach(r => {
      if(r[0]) support.push(r[0]);
      if(r[1]) support.push(r[1]);
      if(r[2]) support.push(r[2]);
    })
    
    for(let p of support) {
      if(p.id != id) result = this.addPhotoToViewList(p, result);
    }

    return result;
  }

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

            //Recupero la foto e la metto nella lista photosRows
            this.s3Service.getPhoto(response.photo_url).subscribe(
              photo => {
                if(!photo) {
                  this.errorWhileUploadingToS3 = true;
                  this.messages = true;
                  return;
                }

                let tmp: Photo = {id: response.id, photo_url: response.photo_url, photo_order: response.photo_order, blob_url: URL.createObjectURL(photo)};
                this.notConfirmedPhotosIDs.push(tmp.id);
                this.notConfirmedPhotosIDsEvent.emit(this.notConfirmedPhotosIDs);

                this.photosRows = this.addPhotoToViewList(tmp, this.photosRows);
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

  public confirmPhotos(): void {
    this.notConfirmedPhotosIDsEvent.emit([]);
    this.closeThisWindowEvent.emit(true);
  }

  clearMessages(): void {
    this.messages = false;
    this.errorWhileSelectingFiles = false;
    this.errorWhileUploadingToS3 = false;
    this.errorRemovingPhoto = false;
    this.successPhotoRemoved = false;
  }

}
