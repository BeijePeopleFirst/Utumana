import { Component } from '@angular/core';
import { imagesURL } from 'src/costants';

@Component({
  selector: 'app-admin-dashboard-home-panel-component',
  templateUrl: './admin-dashboard-home-panel-component.component.html',
  styleUrls: ['./admin-dashboard-home-panel-component.component.css']
})
export class AdminDashboardHomePanelComponent {
  url = imagesURL + "\\house_manager.jpg";
}
