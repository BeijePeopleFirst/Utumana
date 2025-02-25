import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from 'src/app/models/photo';
import { DraftService } from 'src/app/services/draft.service';

@Component({
  selector: 'app-create-accommodation-photos',
  templateUrl: './create-accommodation-photos.component.html',
  styleUrls: ['./create-accommodation-photos.component.css']
})
export class CreateAccommodationPhotosComponent implements OnInit {
  draftId: number;
  genericError: boolean = false;
  photoFiles!: FileList;
  previews!: {id: number, photo_info: string}[];

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
      let urlCreator = window.URL || window.webkitURL;
      let imageUrl;
      for(let photo of photos) {
        this.draftService.getPhoto(photo.id).subscribe(blob => {
          if(!blob) {
            this.genericError = true;
            return;
          }
          
          imageUrl = urlCreator.createObjectURL(blob);
          this.previews.push({id: photo.id, photo_info: imageUrl});
        });
      }
    });
  }

  saveAndContinue(): void {
    this.router.navigate(['/create/confirm/', this.draftId]);
  }
  goBack(): void{
    this.router.navigate(['/create/info/', this.draftId]);
  }

  addPhotos(event: any): void {
    console.log("Photos on add:", event.target.files);
    this.photoFiles = event.target.files;
    if(this.photoFiles && this.photoFiles.length > 0){
      for (let i = 0; i < this.photoFiles.length; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push({id: -1, photo_info: e.target.result});
        };
        reader.readAsDataURL(this.photoFiles[i]);

        this.draftService.uploadPhoto(this.draftId, this.photoFiles[i], this.previews.length - 1).subscribe({
          next: (photo) => {
            if(photo){
              this.previews.find(p => p.id == -1)!.id = photo.id;
              console.log("Photo uploaded", photo);
            }else{
              console.log("Photo upload failed");
            }
          },
          error: error => {
            console.error(error);
          }
        });

        
      }
    }
  }

  removePhoto(preview: {id: number, photo_info: string}): void {
    // remove this line when backend works !!! (possibly removes more than one photo)
    this.previews = this.previews.filter(p => p.photo_info != preview.photo_info);

    // uncomment this line when backend works
    //this.previews = this.previews.filter(p => p.id != preview.id);
    this.draftService.removePhoto(this.draftId, preview.id);
  }
}
