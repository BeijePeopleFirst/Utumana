import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password-by-user-landing-page',
  templateUrl: './reset-password-by-user-landing-page.component.html',
  styleUrls: ['./reset-password-by-user-landing-page.component.css']
})
export class ResetPasswordByUserLandingPageComponent implements OnInit {

  public inputField: string = "";
  private userEmail?: string;
  private token: string = "";

  //MESSAGGES:
  //-----------------------------------------------------------------------------
  thereAreMessages: boolean= false;
  errorNoUserEmailProvided: boolean = false;
  errorInvalidPassword: boolean = false;
  errorUnauthorizedAccess: boolean = false;
  errorUserNotFoundAfterRequest: boolean = false;
  successPasswordUpdated: boolean = false;
  //-----------------------------------------------------------------------------


  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) 
  {}

  ngOnInit() {

    if(!this.route.snapshot.queryParams["token"]) {
      this.errorUnauthorizedAccess = true;
      setTimeout(() => {this.router.navigate(["/"])}, 2400);
      return;
    }

    this.token = this.route.snapshot.queryParams["token"];

    if(!localStorage.getItem("user_email_pswd_reset")) {
      this.errorNoUserEmailProvided = true;
      setTimeout(() => {this.router.navigate(["/"])}, 2400);
      return;
    }

    this.userEmail = localStorage.getItem("user_email_pswd_reset")!;
    localStorage.removeItem("user_email_pswd_reset");
  }

  public resetPassword(): void {
    //TODO: Sistemare interfaccia grafica
    //TODO: Risolvere problema 401 di non invio richiesta

    this.errorInvalidPassword = false;

    if(this.inputField == "") {
      this.errorInvalidPassword = true;
      return;
    }

    this.userService.resetPasswordForUser(this.userEmail!, this.inputField, this.token).subscribe(
      response => {
        if(typeof response != "boolean" && "message" in response) {
          if(response.message.includes("invalid password")) {
            this.errorInvalidPassword = true;
            return;
          }
          else {
            this.errorUserNotFoundAfterRequest = true;
            this.thereAreMessages = true;

            setTimeout(() => {this.router.navigate(["/"])}, 2200);
            return;
          }
        }

        this.successPasswordUpdated = true;
        this.thereAreMessages = true;

        setTimeout(() => {this.router.navigate(["/"])}, 2200);
      }
    )
  }

  clearMessages(): void {
    this.thereAreMessages = false;
    this.successPasswordUpdated = false;
    this.errorUserNotFoundAfterRequest = false;
  }

}
