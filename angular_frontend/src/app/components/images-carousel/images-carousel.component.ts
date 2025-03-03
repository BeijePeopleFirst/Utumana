import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Photo } from 'src/app/models/photo';

@Component({
  selector: 'app-images-carousel',
  templateUrl: './images-carousel.component.html',
  styleUrls: ['./images-carousel.component.css']
})
export class ImagesCarouselComponent implements OnInit {
  
  @Input() photo!: [Photo, number];
  @Input() totalPhotos!: number;

  arrPlaceHolder: boolean[] = [];

  @Output() changePhoto: EventEmitter<{direction: string, currentPhoto: [Photo, number]}> = new EventEmitter<{direction: string, currentPhoto: [Photo, number]}>();


  ngOnInit(): void {
    for(let i = 0; i < this.totalPhotos; i++) this.arrPlaceHolder.push(this.photo[1] === i ? true : false);
  }
  
  changePhotoLeft(): void {

    if(this.photo[1] !== 0) {
      this.arrPlaceHolder[this.photo[1]] = false;
      this.arrPlaceHolder[this.photo[1] - 1] = true;
    }
    
    this.changePhoto.emit({direction: "left", currentPhoto: this.photo});
  }

  changePhotoRight(): void {

    if(this.photo[1] !== this.totalPhotos - 1) {
      this.arrPlaceHolder[this.photo[1]] = false;
      this.arrPlaceHolder[this.photo[1] + 1] = true;
    }
    
    this.changePhoto.emit({direction: "right", currentPhoto: this.photo});
  }
}
