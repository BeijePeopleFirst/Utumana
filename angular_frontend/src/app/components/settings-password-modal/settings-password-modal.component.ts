import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings-password-modal',
  templateUrl: './settings-password-modal.component.html',
  styleUrls: ['./settings-password-modal.component.css']
})
export class SettingsPasswordModalComponent {
  @Input() isModalOpen!: boolean;
  @Output() closeModal = new EventEmitter<void>(); 
  oldPassword: string = '';
  newPassword: string = '';
  newPasswordConfirm: string = '';
  @ViewChild('form') form!: NgForm;

  showOldPasswordError: boolean = false;
  oldPasswordWrong: boolean = false;
  showPasswordError: boolean = false;
  invalidPassword: boolean = false;
  showPasswordConfirmError: boolean = false;
  passwordConfirmDifferent: boolean = false;
  
  constructor(private userService: UserService){}

  close(): void {
    this.closeModal.emit();

    this.showOldPasswordError = false;
    this.oldPasswordWrong = false;
    this.showPasswordError = false;
    this.invalidPassword = false;
    this.showPasswordConfirmError = false;
    this.passwordConfirmDifferent = false;

    this.oldPassword = '';
    this.newPassword = '';
    this.newPasswordConfirm = '';
  }

  updatePassword(): void {
    console.log(this.oldPassword, this.newPassword, this.newPasswordConfirm);
    if(this.form.invalid){
      this.showOldPasswordError = true;
      this.showPasswordError = true;
      this.showPasswordConfirmError = true;
      return;
    }
    if(this.newPassword != this.newPasswordConfirm){
      this.showPasswordConfirmError = true;
      this.passwordConfirmDifferent = true;
      return;
    }
    
    this.userService.changePassword(this.oldPassword, this.newPassword).subscribe(status => {
      if(status == 200){
        this.close();
      }else if(status == 400){  // new password is invalid
        this.invalidPassword = true;
        this.showPasswordError = true;
      }else if(status == 401){  // old password is wrong
        this.oldPasswordWrong = true;
        this.showOldPasswordError = true;
      }
    })
  }
}
