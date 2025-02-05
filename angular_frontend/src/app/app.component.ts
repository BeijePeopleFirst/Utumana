import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Component, DoCheck, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { iconURL } from 'src/costants';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  isLogin: boolean = false;
  isProfileMenuOpen = false;
  isLanguageMenuOpen = false;
  selectedLanguage = 'en-US'; 
  iconUrl = iconURL
  title= 'Utumana'; 
  currentYear: number = new Date().getFullYear();

  languages = [
    { code: 'en-US', name: 'English' },
    { code: 'it-IT', name: 'Italiano' },
  ];

  constructor(
    private translate: TranslateService,
    private location: Location,
    public authService: AuthService
  ) {
    this.selectedLanguage = this.translate.currentLang || 'en-US';
    this.translate.use(this.selectedLanguage);
  }

  ngDoCheck(): void {
    this.isLogin = this.location.path().indexOf('/login') >= 0;
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
