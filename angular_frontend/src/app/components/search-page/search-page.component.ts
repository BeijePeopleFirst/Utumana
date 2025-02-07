import { Component, OnInit } from '@angular/core';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';
import iconURL from 'src/costants';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit{
  iconUrl = iconURL
  foundAccomodations: AccommodationDTO[] | null = null;
  constructor(private accommodationService: AccommodationService) {}

  ngOnInit(){
    this.accommodationService.getSearchResults();
    this.accommodationService.accommodations$.subscribe( data => {
        this.foundAccomodations = data;
    })
  }
}

