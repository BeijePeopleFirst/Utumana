import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PopularOperationTitle } from 'src/app/models/popularOperation';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard-users-add-user',
  templateUrl: './admin-dashboard-users-add-user.component.html',
  styleUrls: ['./admin-dashboard-users-add-user.component.css']
})
export class AdminDashboardUsersAddUserComponent implements OnInit {
  genericError: boolean = false;
  createdMessage: boolean = false;
  user: User = {name: '', surname: '', email: '', password: ''};
  visiblePassword: boolean = false;
  @ViewChild('form', { static: true }) form!: NgForm;

  constructor(private userService: UserService){  }


  ngOnInit(): void {
    this.userService.setUserLatestOperationPerformedAsAdmin(Number(localStorage.getItem("id")), PopularOperationTitle.ADD_USER).subscribe();
  }

  createUser(){
    if(this.form.invalid){
      return;
    }
    console.log("Creating user");

    this.userService.insertUser(this.user).subscribe({
      next: ok => {
        if(ok){
          this.form.resetForm();
          this.createdMessage = true;
          setTimeout(() => {
            this.createdMessage = false;
          }, 3000);
        }else{
          this.genericError = true;
        }
      }, error: error => {
        console.log(error);
        this.genericError = true;
      }
    });
  }
}
