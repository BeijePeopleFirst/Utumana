import { Component } from '@angular/core';
import { UserDTO } from 'src/app/dtos/userDTO';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard-profile-list',
  templateUrl: './admin-dashboard-profile-list.component.html',
  styleUrls: ['./admin-dashboard-profile-list.component.css']
})
export class AdminDashboardProfileListComponent {
toggleEdit() {
alert('toggleEdit');
}

  users: UserDTO[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAllUsersDto().subscribe(users => {
      this.users = users;
      console.log(this.users);
    });
  }

  updateUser(updatedUser: UserDTO) {
    this.users = this.users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
  }
}
