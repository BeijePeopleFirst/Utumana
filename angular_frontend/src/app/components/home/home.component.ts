import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { iconURL } from 'src/costants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  iconUrl = iconURL;

  constructor(
    private router: Router
  ){ }
  
  ngOnInit(): void {
    // if not token, redirect to login
    const token = localStorage.getItem("token");
	  if(!token){
      this.router.navigate(['login']);
    }
  }
}
