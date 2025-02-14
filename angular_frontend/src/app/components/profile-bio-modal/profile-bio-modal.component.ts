import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-bio-modal',
  templateUrl: './profile-bio-modal.component.html',
  styleUrls: ['./profile-bio-modal.component.css']
})
export class ProfileBioModalComponent {
  @Input() isModalOpen!: boolean;
  @Input() userId!: number;
  @Input() bio!: string;
  @Output() closeModal = new EventEmitter<boolean>();
  error: boolean = false;

  constructor(private userService: UserService){}

  close(): void {
    this.closeModal.emit(false);
  }

  updateBio(): void {
    this.error = false;
    this.userService.updateBio(this.userId, this.bio).subscribe(ok => {
      if(ok === true){
        this.closeModal.emit(true);
      }else{
        this.error = true;
      }
    })
  }
}
