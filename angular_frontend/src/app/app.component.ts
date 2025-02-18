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
  isMenuOpen = false;
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
    //this.translate.use(this.selectedLanguage);
    this.selectedLanguage = localStorage.getItem("currLan") ?? 'en-US';
    this.translate.use(this.selectedLanguage)
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

  toggleMobileMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
    if(this.isMenuOpen === false){
      this.isProfileMenuOpen = false;
      this.isLanguageMenuOpen = false;
    }
  }

  changeLanguage(langCode: string, event: Event) {
    event.stopPropagation(); 
    this.selectedLanguage = langCode;
    this.translate.use(langCode);
    this.isLanguageMenuOpen = false;
    this.isMenuOpen = false;
    localStorage.setItem("currLan", langCode);
  }

  @HostListener('document:click', ['$event'])
  closeMenus() {
      this.isProfileMenuOpen = false;
      this.isLanguageMenuOpen = false;
      this.isMenuOpen = false;
    }
}
