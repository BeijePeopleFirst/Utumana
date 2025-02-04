import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import iconURL from 'src/costants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private translateService: TranslateService){
	// set default language
	translateService.setDefaultLang('en-US');
  }
  title = 'angular_frontend';
  iconUrl = iconURL;
}
