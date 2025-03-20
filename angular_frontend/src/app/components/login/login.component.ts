import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthCredentials } from 'src/app/dtos/authCredential';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailError: boolean = false;  // true if backend has sent error: email not found
  passwordError: boolean = false; // true if backend has sent error: wrong password
  genericError: boolean = false;  // true if backend has sent error with staus 500
  showEmailError: boolean = false;
  showPasswordError: boolean = false;
  user: AuthCredentials = {email: '', password: ''};
  @ViewChild('loginForm', { static: true }) loginForm!: NgForm;
  visiblePassword: boolean = false;

  returnUrl: string = '';

  showEmailSent: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ){ }
  
  ngOnInit(): void {
    // if already logged in, redirect to home page
	  if(this.authService.isLoggedIn === true){
      this.router.navigate(['']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if(this.returnUrl.indexOf("login") >= 0){
      this.returnUrl = '/';
    }
  }

  login(): void {
    if(this.loginForm.invalid){
      this.showEmailError = true;
      this.showPasswordError = true;
      return;
    }
    this.authService.login(this.user).subscribe(res => {
      console.log("AuthService: login response", res);
      if(res.ok === true){
        console.log("Return url:", this.returnUrl);
        this.router.navigate([this.returnUrl]);
      }else{
        if(res.status == 401){
          if(res.message.includes("password")){
            this.passwordError = true;
            this.showPasswordError = true;
          }else{
            this.emailError = true;
            this.showEmailError = true;
            console.log("email error");
          }
        }else{
            this.genericError = true;
        }
      }
    })
  }

  forgotPassword(): void {
    console.log("Clicked forgot password");

    if(!this.user.email || this.user.email == "") {
      this.showEmailError = true;
      return;
    }

    this.showEmailError = false;

    //This API will also check that the User exists
    this.authService.sendResetPasswordRequestByUser(this.user.email).subscribe(
      response => {
        if(typeof response != "boolean" && "message" in response) {
          this.emailError = true;
          this.showEmailError = true;
          return;
        }

        if(response && response === true) {
          this.showEmailSent = true;

          localStorage.setItem("user_email_pswd_reset", "" + this.user.email);

          setTimeout(() => {this.showEmailSent = false}, 2000);
          
        }
      }
    )
    
  }
}
