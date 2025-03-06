import { Component } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-admin-dashboard-users-add-user',
  templateUrl: './admin-dashboard-users-add-user.component.html',
  styleUrls: ['./admin-dashboard-users-add-user.component.css']
})
export class AdminDashboardUsersAddUserComponent {
  genericError: boolean = false;
  user: User = {name: '', surname: '', email: '', password: ''};
  visiblePassword: boolean = false;

  createUser(){
    console.log("Creating user");
  }
}
