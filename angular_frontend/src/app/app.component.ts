import { Component } from '@angular/core';
import iconURL from 'src/costants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular_frontend';
  iconUrl = iconURL;
}
