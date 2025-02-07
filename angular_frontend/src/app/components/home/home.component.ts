import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { iconURL } from 'src/costants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  iconUrl = iconURL;

  latestUploads$!: Observable<AccommodationDTO[] | null> ;
  mostLiked:  AccommodationDTO[] | null=null;

  constructor(
    private router: Router,
    private accommodationService:AccommodationService
  ){ }
  
  ngOnInit(): void {
    this.accommodationService.getLatestUploads();
    this.latestUploads$ = this.accommodationService.accommodations$
  }
}
