import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthCredentials } from 'src/app/dtos/authCredential';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailError: boolean = false;  // true if backend has sent error: email not found
  passwordError: boolean = false; // true if backend has sent error: wrong password
  error500: boolean = false;  // true if backend has sent error with staus 500
  showEmailError: boolean = false;
  showPasswordError: boolean = false;
  user: AuthCredentials = {email: '', password: ''};
  @ViewChild('loginForm', { static: true }) loginForm!: NgForm;

  returnUrl: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ){ }
  
  ngOnInit(): void {
    // if already logged in, redirect to home page
	  if(this.authService.isLoggedIn === true){
      this.router.navigate(['']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(): void {
    if(this.loginForm.invalid){
      this.showEmailError = true;
      this.showPasswordError = true;
      return;
    }
  }
}
