// search-page.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { FiltersService } from 'src/app/services/filters.service';
import { SearchService } from 'src/app/services/search.service';
import { params } from 'src/app/models/searchParams';
import iconURL from 'src/costants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  
  iconUrl = iconURL;
  
  foundAccommodations$!: Observable<AccommodationDTO[] | null>;
  foundAccommodationsPageSize!: number;
  foundAccommodationsPageNumber!: number;
  foundAccommodationsTotalPages!: number;
  
  services$ = this.filterService.services$;
  searchParams$ = this.searchService.searchData$;
  currentOrderBySelected$ = new BehaviorSubject<string>('');
  translatedOrderText$: Observable<string>;

  showFilters: boolean = false;
  isOrderByOpen: boolean = false;

  constructor(
    private accommodationService: AccommodationService,
    private route: ActivatedRoute,
    private router: Router,
    private filterService: FiltersService,
    private searchService: SearchService,
    private translate: TranslateService
  ) {
    this.translatedOrderText$ = this.currentOrderBySelected$.pipe(
      switchMap(order => this.translate.get(`search.${order}`))
    );
  }

  ngOnInit() {
    this.foundAccommodationsPageSize = 4;
    this.foundAccommodationsPageNumber = 0;
    this.foundAccommodationsTotalPages = 2; 
    this.foundAccommodations$ = this.accommodationService.foundAccommodations$;
    
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
      this.currentOrderBySelected$.next(searchParams.order_by);
      this.searchService.setSearchData(searchParams);
      
      this.loadFoundResearchPage(0);
      this.filterService.getAllServices();
      this.filterService.setSelectedFilters(searchParams.services);
    });
  }

  search(params: params): void {
    const currentParams = this.route.snapshot.queryParams;
    const searchParams: params = {
      destination: params.destination || '',
      ['check-in']: params['check-in']|| currentParams['check-in'] || '',
      ['check-out']: params['check-out']|| currentParams['check-out'] || '',
      number_of_guests: params.number_of_guests || currentParams['number_of_guests'] || 1,
      free_only: params.free_only ,
      services: params.services || [''],
      order_by: params.order_by || currentParams['order_by'] || '',
    };
    this.searchService.setSearchData(searchParams);
    this.router.navigate(['/search_page/'], { queryParams: searchParams});
  }

  onApplyFilters(selectedServices: string[]): void {
    this.filterService.setSelectedFilters(selectedServices);
    const curr = this.searchService.getSearchData();
    curr.services = selectedServices || [''];
    this.search(curr);
  }

  loadFoundResearchPage(pageNumber: number): void {
    this.foundAccommodationsPageNumber = pageNumber;
    this.accommodationService.getSearchResults(this.foundAccommodationsPageNumber * this.foundAccommodationsPageSize, this.foundAccommodationsPageSize);
  }

  toggleOrderByMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isOrderByOpen = !this.isOrderByOpen;
  }

  setOrderParam(orderBy: string, event: MouseEvent) {
    event.stopPropagation()
    const curr = this.searchService.getSearchData();
    curr.order_by = orderBy;
    this.currentOrderBySelected$.next(orderBy); 
    this.isOrderByOpen = false;
    this.search(curr);
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.relative')) {
      this.isOrderByOpen= false;
    }
  } 

}