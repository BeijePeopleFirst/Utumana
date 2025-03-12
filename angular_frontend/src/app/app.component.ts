import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Component, DoCheck, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { iconURL } from 'src/costants';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';
import { DraftService } from './services/draft.service';
import { Subscription } from 'rxjs';
import { S3Service } from './services/s3.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck, OnDestroy {
  isLogin: boolean = false;
  isProfileMenuOpen = false;
  isLanguageMenuOpen = false;
  isCreateMenuOpen = false;
  isMenuOpen = false;
  selectedLanguage = 'en-US'; 
  iconUrl = iconURL;
  defaultProfileUrl: string = iconURL + '/profile.png';
  profileUrl: string = this.defaultProfileUrl;
  title= 'Utumana'; 
  currentYear: number = new Date().getFullYear();

  isAdmin: boolean | null = null;
  checkIsAdmin!: Subscription;
  hasOpenDrafts: boolean = true;
  checkOpenDrafts!: Subscription;
  getProfilePictureUrl!: Subscription;

  languages = [
    { code: 'en-US', name: 'English' },
    { code: 'it-IT', name: 'Italiano' },
  ];

  constructor(
    private translate: TranslateService,
    private location: Location,
    public authService: AuthService,
    private draftService: DraftService,
    private s3Service: S3Service,
    private router: Router
  ) {
    this.selectedLanguage = this.translate.currentLang || 'en-US';
    //this.translate.use(this.selectedLanguage);
    this.selectedLanguage = localStorage.getItem("currLan") ?? 'en-US';
    this.translate.use(this.selectedLanguage);
  }

  ngOnInit(): void {
    // update isAdmin after user logs in
    this.checkIsAdmin = this.authService.isUserAdmin$.subscribe(isUserAdmin => {
      this.isAdmin = isUserAdmin;
      console.log("Updated value for isAdmin: ", this.isAdmin);
    });
    // update isAdmin if logged user refreshes page
    if(this.isAdmin === null){
      this.authService.isAdmin().subscribe(isUserAdmin => {
        this.authService.isUserAdmin$.next(isUserAdmin);
      });
    }

    // subscribe to hasOpenDrafts$
    this.checkOpenDrafts = this.draftService.hasOpenDrafts$.subscribe(hasOpen => {
      this.hasOpenDrafts = hasOpen;
    });
    // update hasOpenDrafts if logged user refreshes page
    const savedHasOpen = localStorage.getItem("hasOpenDrafts");
    if(savedHasOpen !== null){
      this.draftService.hasOpenDrafts$.next(savedHasOpen === "true");
    }

    let pictureUrl: string = '';
    // subscribe to get profile picture url
    this.getProfilePictureUrl = this.authService.profilePictureUrl$.subscribe(url => {
      pictureUrl = url;
      // get profile picture
      if(pictureUrl !== ''){
        this.s3Service.getPhoto(pictureUrl).subscribe(blob => {
          if(blob != null){
            this.profileUrl = URL.createObjectURL(blob);
          }
        })
      }
    });
    // update profile picture url if logged user refreshes page
    const savedProfileUrl = localStorage.getItem("profilePictureUrl");
    console.log("Retrieved url from storage:", savedProfileUrl);
    if(savedProfileUrl){
      pictureUrl = savedProfileUrl;
    }
    // get profile picture
    if(pictureUrl !== ''){
      this.s3Service.getPhoto(pictureUrl).subscribe(blob => {
        if(blob != null){
          this.profileUrl = URL.createObjectURL(blob);
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.checkIsAdmin.unsubscribe();
    this.checkOpenDrafts.unsubscribe();
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

  closeMenusAndNavigateTo(url: string, event: Event) {
    event.stopPropagation();
    this.closeMenus();
    this.router.navigate([url]);
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
