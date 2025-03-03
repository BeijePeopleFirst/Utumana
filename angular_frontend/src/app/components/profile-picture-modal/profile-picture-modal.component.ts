import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-picture-modal',
  templateUrl: './profile-picture-modal.component.html',
  styleUrls: ['./profile-picture-modal.component.css']
})
export class ProfilePictureModalComponent {
  @Input() isModalOpen!: boolean;
  @Input() userId!: number;
  pictureFile!: File;
  picturePreview: string | null = null;
  @Output() closeModal = new EventEmitter<boolean>();
  error: boolean = false;

  constructor(private userService: UserService){}

  close(): void {
    this.closeModal.emit(false);
  }

  updatePicture(): void {
    console.log("Saving new picture...");
    this.error = false;
    this.userService.updatePicture(this.pictureFile).subscribe(ok => {
      if(ok === true){
        this.closeModal.emit(true);
      }else{
        this.error = true;
      }
    })
  }

  showPhoto(event: any){
    this.pictureFile = event.target.files[0];
    console.log(this.pictureFile);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.picturePreview = e.target.result;
    };

    reader.readAsDataURL(this.pictureFile);
  }
}
