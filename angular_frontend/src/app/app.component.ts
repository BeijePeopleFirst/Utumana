import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { iconURL } from 'src/costants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isProfileMenuOpen = false;
  isLanguageMenuOpen = false;
  selectedLanguage = 'en-US'; 
  iconUrl = iconURL
  title= 'angular_frontend'; 
  currentYear: number = new Date().getFullYear();

  languages = [
    { code: 'en-US', name: 'English' },
    { code: 'it-IT', name: 'Italiano' },
  ];

  constructor(private translate: TranslateService) {
    this.selectedLanguage = this.translate.currentLang || 'en-US';
    this.translate.use(this.selectedLanguage);
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.isLanguageMenuOpen = false;
  }

  toggleLanguageMenu(event: Event) {
    event.stopPropagation();
    this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
    this.isProfileMenuOpen = false;
  }

  changeLanguage(langCode: string) {
    this.selectedLanguage = langCode;
    this.translate.use(langCode);
    this.isLanguageMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.relative')) {
      this.isProfileMenuOpen = false;
      this.isLanguageMenuOpen = false;
    }
  }
}
