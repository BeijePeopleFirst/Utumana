import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-operation-row',
  templateUrl: './admin-operation-row.component.html',
  styleUrls: ['./admin-operation-row.component.css']
})
export class AdminOperationRowComponent {

  @Input() name!: string;


  constructor(
    private router: Router
  )
  {}

  goToSection(): void {
    switch(this.name) {

      case "HOME":
      default:
        this.router.navigate(["/admin-dashboard/home"]);
        break;

      case "APPROVE_REJECT_ACCOMMODATIONS":
        this.router.navigate(["/admin-dashboard/accommodations/accept-reject"]);
        break;
        
      case "ACTIVE_ACCOMMODATIONS":
        this.router.navigate(["/admin-dashboard/accommodations/active-ones"]);
        break;
        
      case "INACTIVE_ACCOMMODATIONS":
        this.router.navigate(["/admin-dashboard/accommodations/inactive-ones"]);
        break;
        
      case "ALL_ACCOMMODATIONS":
        this.router.navigate(["/admin-dashboard/accommodations/all-accommodations"]);
        break;
        
      case "PROFILES":
        this.router.navigate(["/admin-dashboard/users/profiles"]);
        break;
        
      case "ADD_USER":
        this.router.navigate(["/admin-dashboard/users/add-user"]);
        break;
        
      case "ADMINS":
        this.router.navigate(["/admin-dashboard/users/admins"]);
        break;
        
      case "METRICS":
        this.router.navigate(["/admin-dashboard/metrics"]);
        break;
        
      case "CUSTOMIZE":
        this.router.navigate(["/admin-dashboard/customize"]);
        break;
        
    }
  }

}
