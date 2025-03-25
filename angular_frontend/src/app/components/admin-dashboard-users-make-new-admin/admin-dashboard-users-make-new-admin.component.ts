import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, Observable, Subject, switchMap } from 'rxjs';
import { UserDTO } from 'src/app/dtos/userDTO';
import { PopularOperationTitle } from 'src/app/models/popularOperation';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { imagesURL } from 'src/costants';

@Component({
  selector: 'app-admin-dashboard-users-make-new-admin',
  templateUrl: './admin-dashboard-users-make-new-admin.component.html',
  styleUrls: ['./admin-dashboard-users-make-new-admin.component.css']
})
export class AdminDashboardUsersMakeNewAdminComponent {
  admins: UserDTO[] = [];
  currentUserId: number;
  defaultPictureUrl: string = `${imagesURL}\\default_profile.png`;

  error: boolean = false;
  success: boolean = false;
  selectedUser: UserDTO | null = null;
  isRevokePrivilegeseModalOpen: boolean = false;
  isMakeAdminModalOpen: boolean = false;
  foundUsers$!: Observable<UserDTO[]>;
  private searchTerms = new Subject<string>();
  @ViewChild('searchBox') searchBox!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.currentUserId = localStorage.getItem('id') ? Number(localStorage.getItem('id')) : 0;
  }

  ngOnInit() {
    this.userService.setUserLatestOperationPerformedAsAdmin(Number(localStorage.getItem("id")), PopularOperationTitle.ADMINS).subscribe();
    this.userService.getAllAdminsDTO().subscribe(users => {
      this.admins = users;
    });

    this.foundUsers$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.userService.searchUsers(term).pipe(
        map(res => {
            return res.filter((user: UserDTO) => !this.admins.find((s: UserDTO) => s.id === user.id))
                      .slice(0, 10); // returns only the first ten results
        })
      )));
  }

  showRevokePrivilegesModal(user: UserDTO) {
    this.selectedUser = user;
    this.isRevokePrivilegeseModalOpen = true;
    document.body.style.overflow = 'hidden';
    console.log("User: ", user, ", currentUserId: ", this.currentUserId);
  }

  closeRevokePrivilegesModal(){
    this.isRevokePrivilegeseModalOpen = false;
    this.selectedUser = null;
    this.error = false;
    this.success = false;
    document.body.style.overflow = 'auto';
  }

  revokeAdminPrivileges() {
    if(this.selectedUser && this.selectedUser.id) {
      this.userService.revokeAdminPrivileges(this.selectedUser.id).subscribe(ok => {
        if(ok){
          this.success = true;
          this.userService.getAllAdminsDTO().subscribe(users => {
            this.admins = users;
          });
          setTimeout(() => {
            if(this.selectedUser && this.selectedUser.id && this.selectedUser.id === this.currentUserId){
              this.authService.logout();
            }
            this.closeRevokePrivilegesModal();
          }, 1500);
        }else{
          this.error = true;
        }
      });
    }
  }

  search(searchText: string): void{
    this.searchTerms.next(searchText);
  }

  showMakeAdminModal(user: UserDTO) {
    this.selectedUser = user;
    this.isMakeAdminModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeMakeAdminModal(){
    this.isMakeAdminModalOpen = false;
    this.selectedUser = null;
    this.error = false;
    this.success = false;
    document.body.style.overflow = 'auto';
  }

  makeAdmin(){
    if(this.selectedUser && this.selectedUser.id){
      this.userService.issueAdminPrivilegesTo(this.selectedUser.id).subscribe(ok => {
        if(ok){
          this.success = true;
          this.userService.getAllAdminsDTO().subscribe(users => {
            this.admins = users;
          });
          this.searchBox.nativeElement.value = '';
          this.searchTerms.next('');
          setTimeout(() => {
            this.closeMakeAdminModal();
          }, 1500);
        }else{
          this.error = true;
        }
      });
    }
  }
}
