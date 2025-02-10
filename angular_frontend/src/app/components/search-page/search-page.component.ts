// search-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { FiltersService } from 'src/app/services/filters.service';
import { SearchService } from 'src/app/services/search.service';
import { params } from 'src/app/models/searchParams';
import iconURL from 'src/costants';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  iconUrl = iconURL;
  foundAccommodations$!: Observable<AccommodationDTO[] | null>;
  showFilters = false;
  services$ = this.filterService.services$;

  constructor(
    private accommodationService: AccommodationService,
    private route: ActivatedRoute,
    private router: Router,
    private filterService: FiltersService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      const searchParams: params = {
        destination: queryParams['destination'] || '',
        ['check-in']: queryParams['check-in'] || '',
        ['check-out']: queryParams['check-out'] || '',
        number_of_guests: queryParams['number_of_guests'] || 1,
        free_only: queryParams['free_only'] || false,
        services: queryParams['services'] 
        ? (Array.isArray(queryParams['services']) ? queryParams['services'] : [queryParams['services']]) 
        : [''],
        order_by: queryParams['order_by'] || ''
      };
      
      this.performSearch(searchParams);
      this.filterService.getAllServices();
      this.filterService.setSelectedFilters(searchParams.services);
    });
  }

  search(params: params): void {
    const currentParams = this.route.snapshot.queryParams;
    const searchParams: params = {
      destination: params.destination ||  '',
      ['check-in']: params['check-in']|| currentParams['check-in'] || '',
      ['check-out']: params['check-out']|| currentParams['check-out'] || '',
      number_of_guests: params.number_of_guests|| currentParams['number_of_guests'] || 1,
      free_only: currentParams['free_only'] || false,
      services: params.services || [''],
      order_by: currentParams['order_by'] || ''
    };

    this.searchService.setSearchData(searchParams);
    this.router.navigate(['/search_page/'], { queryParams: searchParams});
  }

  onApplyFilters(selectedServices: string[]): void {
    console.log("filet", selectedServices)
    this.filterService.setSelectedFilters(selectedServices);
    const curr = this.searchService.getSearchData();
    curr.services = this.filterService.getSelectedFilters().map(id => id.toString()) || [''];
    console.log("curr: ", curr);
    this.search(curr);
  }

  performSearch(searchParams: params) {
    this.accommodationService.searchAccommodations(searchParams);
    this.foundAccommodations$ = this.accommodationService.getSearchResults();
  }

}