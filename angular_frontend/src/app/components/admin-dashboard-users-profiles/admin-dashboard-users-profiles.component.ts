import { Component, OnInit } from '@angular/core';
import { PopularOperationTitle } from 'src/app/models/popularOperation';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard-users-profiles',
  templateUrl: './admin-dashboard-users-profiles.component.html',
  styleUrls: ['./admin-dashboard-users-profiles.component.css']
})
export class AdminDashboardUsersProfilesComponent implements OnInit {


  constructor(private userService: UserService)
  {}

  ngOnInit(): void {
    this.userService.setUserLatestOperationPerformedAsAdmin(Number(localStorage.getItem("id")), PopularOperationTitle.PROFILES).subscribe();
  }

}
