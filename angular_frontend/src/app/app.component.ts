import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Component, DoCheck, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { iconURL } from 'src/costants';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';
import { DraftService } from './services/draft.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  isLogin: boolean = false;
  isProfileMenuOpen = false;
  isLanguageMenuOpen = false;
  isCreateMenuOpen = false;
  isMenuOpen = false;
  selectedLanguage = 'en-US'; 
  iconUrl = iconURL
  title= 'Utumana'; 
  currentYear: number = new Date().getFullYear();

  isAdmin: boolean;

  languages = [
    { code: 'en-US', name: 'English' },
    { code: 'it-IT', name: 'Italiano' },
  ];

  constructor(
    private translate: TranslateService,
    private location: Location,
    public authService: AuthService,
    private draftService: DraftService,
    private router: Router
  ) {
    this.selectedLanguage = this.translate.currentLang || 'en-US';
    //this.translate.use(this.selectedLanguage);
    this.selectedLanguage = localStorage.getItem("currLan") ?? 'en-US';
    this.translate.use(this.selectedLanguage);

    this.isAdmin = false;
    let roles = localStorage.getItem("roles");
    if(roles != null){
      this.isAdmin = JSON.parse(roles).includes("ADMIN");
    }
  }

  ngDoCheck(): void {
    this.isLogin = this.location.path().indexOf('/login') >= 0;
  }


  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.isLanguageMenuOpen = false;
    this.isCreateMenuOpen = false;
  }

  toggleLanguageMenu(event: Event) {
    event.stopPropagation();
    this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
    this.isProfileMenuOpen = false;
    this.isCreateMenuOpen = false;
  }

  toggleMobileMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
    if(this.isMenuOpen === false){
      this.isProfileMenuOpen = false;
      this.isLanguageMenuOpen = false;
      this.isCreateMenuOpen = false;
    }
  }

  toggleCreateMenu(event: Event){
    event.stopPropagation();
    this.isCreateMenuOpen = !this.isCreateMenuOpen;
    this.isProfileMenuOpen = false;
    this.isLanguageMenuOpen = false;
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
      this.isCreateMenuOpen = false;
      this.isMenuOpen = false;
    }

  createAccommodationDraft(){
    this.draftService.createAccommodationDraft().subscribe(draftId => {
      if(draftId >= 0){
        this.isCreateMenuOpen = false;
        this.isMenuOpen = false;
        this.router.navigate([`/create/address/${draftId}`]);
      }else{
        alert("Error creating draft");
      }
    }, error => {
      if(error.status == 403){
        alert("Error: max number of drafts reached");
      }else{
        alert("Error creating draft");
      }
    });
  }

  openDrafts(){
    this.router.navigate(['/my_accommodations'], { fragment: "drafts" });
  }
}
