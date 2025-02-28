import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Photo } from 'src/app/models/photo';
import { DraftService } from 'src/app/services/draft.service';
import { S3Service } from 'src/app/services/s3.service';
import { MAX_NUMBER_OF_PHOTOS_PER_ACCOMMODATION, s3Prefix } from 'src/costants';

@Component({
  selector: 'app-create-accommodation-photos',
  templateUrl: './create-accommodation-photos.component.html',
  styleUrls: ['./create-accommodation-photos.component.css']
})
export class CreateAccommodationPhotosComponent implements OnInit {
  draftId: number;
  photoFiles!: FileList;
  previews!: Photo[];

  genericError: boolean = false;
  payloadTooLarge: boolean = false;
  fileToolarge: string = '';
  tooManyPhotos: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private draftService: DraftService,
    private s3Service: S3Service
  ) {
    this.draftId = this.route.snapshot.params['draftId'];
  }

  ngOnInit(): void {
    this.draftService.getPhotos(this.draftId).subscribe(photos => {
      if(!photos) {
        this.genericError = true;
        return;
      }
      console.log("Photos on init:", photos);
      this.previews = [];
      for(let photo of photos){
        this.s3Service.getPhoto(photo.photo_url).subscribe(blob => {
          if(blob == null){
            this.genericError = true;
            return;
          }
          photo.blob_url = URL.createObjectURL(blob);
          this.previews.push(photo);
        })
      }
    });
  }

  saveAndContinue(): void {
    this.router.navigate(['/create/confirm/', this.draftId]);
  }
  goBack(): void{
    this.router.navigate(['/create/info/', this.draftId]);
  }

  async addPhotos(event: any): Promise<void> {
    console.log("Adding photo files:", event.target.files);
    this.photoFiles = event.target.files;
    this.fileToolarge = '';
    if(this.photoFiles && this.photoFiles.length > 0){
      let startingOrderPosition = this.previews.length;
      let currentUpload;
      for (let i = 0; i < this.photoFiles.length; i++) {
        if(startingOrderPosition + i >= MAX_NUMBER_OF_PHOTOS_PER_ACCOMMODATION){
          this.tooManyPhotos = true;
          return;
        }
        currentUpload = this.draftService.uploadPhoto(this.draftId, this.photoFiles[i], startingOrderPosition + i);
        await lastValueFrom(currentUpload).then(photo => {
          if(photo){
            this.s3Service.getPhoto(photo.photo_url).subscribe(blob => {
              if(blob == null){
                this.genericError = true;
                return;
              }
              photo.blob_url = URL.createObjectURL(blob);
              this.previews.push(photo);
            })
            console.log("Photo uploaded", photo);
          }else{
            console.log("Photo upload failed");
          }
        })
        .catch(error => {
          console.error(error);
            if(error.status == 413){  // payload too large
              this.fileToolarge = this.fileToolarge + " " + this.photoFiles[i].name;
              this.payloadTooLarge = true;
              setTimeout(() => {
                this.payloadTooLarge = false;
              }, 5000);
            }
        });
      }
    }
  }

  removePhoto(preview: Photo): void {
    for(let i=0; i<this.previews.length; i++){
      if(this.previews[i].photo_order > preview.photo_order){
        this.previews[i].photo_order--;
      }
    }
    this.previews = this.previews.filter(p => p.id != preview.id);
    this.draftService.removePhoto(this.draftId, preview.id);
  }
}
