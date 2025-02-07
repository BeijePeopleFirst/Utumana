import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  foundAccommodations: AccommodationDTO[] | null = null;
  constructor(private accommodationService: AccommodationService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      console.log('Query Params cambiati:', queryParams);
  
      this.accommodationService.searchAccommodations(queryParams);
      this.accommodationService.getSearchResults();
    });
  
    this.accommodationService.accommodations$.subscribe(data => {
      this.foundAccommodations = data;
    });
  }
}

