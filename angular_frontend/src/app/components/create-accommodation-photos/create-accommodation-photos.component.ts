import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from 'src/app/models/photo';
import { DraftService } from 'src/app/services/draft.service';
import { imagesPrefix } from 'src/costants';

@Component({
  selector: 'app-create-accommodation-photos',
  templateUrl: './create-accommodation-photos.component.html',
  styleUrls: ['./create-accommodation-photos.component.css']
})
export class CreateAccommodationPhotosComponent implements OnInit {
  draftId: number;
  genericError: boolean = false;
  payloadTooLarge: boolean = false;
  photoFiles!: FileList;
  previews!: Photo[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private draftService: DraftService
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
        photo.photo_url = imagesPrefix + photo.photo_url;
        this.previews.push(photo);
      };
    });
  }

  saveAndContinue(): void {
    this.router.navigate(['/create/confirm/', this.draftId]);
  }
  goBack(): void{
    this.router.navigate(['/create/info/', this.draftId]);
  }

  addPhotos(event: any): void {
    console.log("Adding photo files:", event.target.files);
    this.photoFiles = event.target.files;
    if(this.photoFiles && this.photoFiles.length > 0){
      let startingOrderPosition = this.previews.length;
      for (let i = 0; i < this.photoFiles.length; i++) {
        this.draftService.uploadPhoto(this.draftId, this.photoFiles[i], startingOrderPosition + i).subscribe({
          next: (photo) => {
            if(photo){
              photo.photo_url = imagesPrefix + photo.photo_url;
              this.previews.push(photo);
              console.log("Photo uploaded", photo);
            }else{
              console.log("Photo upload failed");
            }
          },
          error: error => {
            console.error(error);
            if(error.status == 413){  // payload too large
              this.payloadTooLarge = true;
              setTimeout(() => {
                this.payloadTooLarge = false;
              }, 5000);
            }
          }
        });
      }
    }
  }

  removePhoto(preview: Photo): void {
    this.previews = this.previews.filter(p => p.id != preview.id);
    this.draftService.removePhoto(this.draftId, preview.id);
  }
}
