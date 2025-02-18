import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { FiltersService} from 'src/app/services/filters.service';
import { SearchService } from 'src/app/services/search.service';
import iconURL from 'src/costants';
import { TranslateService } from '@ngx-translate/core';
import { CompleteParams } from 'src/app/models/completeParams';
import { FilterParams } from 'src/app/models/filterParams';

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
  currentOrderBySelected$ = new BehaviorSubject<string[]>(['approvalTimestamp', 'desc']);
  translatedOrderText$: Observable<string> = this.currentOrderBySelected$.pipe(
    switchMap(order => this.translate.get(`search.${order[0]}-${order[1].toLowerCase()}`))
  );

  showFilters: boolean = false;
  isOrderByOpen: boolean = false;

  constructor(
    private accommodationService: AccommodationService,
    private route: ActivatedRoute,
    private router: Router,
    private filterService: FiltersService,
    private searchService: SearchService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.foundAccommodationsPageSize = 8;
    this.foundAccommodationsPageNumber = 0;
    this.foundAccommodationsTotalPages = 2;
    this.foundAccommodations$ = this.accommodationService.foundAccommodations$;

    this.route.queryParams.subscribe(queryParams => {
      const services = queryParams['services']
        ? (Array.isArray(queryParams['services'])
            ? [...queryParams['services']]
            : [queryParams['services']])
        : [];

      const searchParams: CompleteParams = {
        destination: queryParams['destination'],
        ['check-in']: queryParams['check-in'] ?? '',
        ['check-out']: queryParams['check-out'] ?? '',
        number_of_guests: queryParams['number_of_guests'],
        free_only: queryParams['free_only'],
        services: services,
        order_by: queryParams['order_by'],
        order_direction: queryParams['order_direction'],
        min_price: queryParams['min_price'],
        max_price: queryParams['max_price'],
        min_rating: queryParams['min_rating'],
        max_rating: queryParams['max_rating']
      };

      this.currentOrderBySelected$.next([
        searchParams.order_by ?? 'approvalTimestamp',
        searchParams.order_direction ?? 'desc'
      ]);

      this.searchService.setSearchData(searchParams);
      this.filterService.getAllServices();
      const filterParams: FilterParams = {
        services: services,
        min_price: searchParams.min_price,
        max_price: searchParams.max_price,
        min_rating: searchParams.min_rating,
        max_rating: searchParams.max_rating
      };
      this.filterService.setSelectedFilters(filterParams);
      this.loadFoundResearchPage(0);
    });
  }

  search(params: CompleteParams): void {
    const currentParams = this.route.snapshot.queryParams;
    const services = params.services
      ? (Array.isArray(params.services) ? [...params.services] : [params.services])
      : [];
  
    console.log("services:", services);
    const searchParams: CompleteParams = {
      destination: params.destination,
      ['check-in']: params['check-in'] ?? currentParams['check-in'] ?? '',
      ['check-out']: params['check-out'] ?? currentParams['check-out'] ?? '',
      number_of_guests: params.number_of_guests ?? currentParams['number_of_guests'],
      free_only: params.free_only ?? currentParams['free_only'],
      services: services.length > 0 ? services : undefined,
      order_by: params.order_by ?? currentParams['order_by'],
      order_direction: params.order_direction ?? currentParams['order_direction'],
      min_price: params.min_price,
      max_price: params.max_price,
      min_rating: params.min_rating,
      max_rating: params.max_rating
    };
  
    const cleanedParams: CompleteParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined)
    );
  
    //console.log("params search:", cleanedParams);
  
    this.searchService.setSearchData(cleanedParams);
    this.router.navigate(['/search_page/'], { queryParams: cleanedParams });
  }
  

  onApplyFilters(filters: FilterParams): void {
    this.filterService.setSelectedFilters(filters);
    const currentSearchParams = this.searchService.getSearchData();
    const updatedParams: CompleteParams = {
      ...currentSearchParams,
      services: filters.services,
      min_price: filters.min_price,
      max_price: filters.max_price,
      min_rating: filters.min_rating,
      max_rating: filters.max_rating
    };
    this.search(updatedParams);
  }

  loadFoundResearchPage(pageNumber: number): void {
    this.foundAccommodationsPageNumber = pageNumber;
    this.accommodationService.getSearchResults(
      this.foundAccommodationsPageNumber * this.foundAccommodationsPageSize,
      this.foundAccommodationsPageSize
    );
  }

  toggleOrderByMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isOrderByOpen = !this.isOrderByOpen;
  }

  setOrderParam(orderBy: string, orderDirection: string, event: MouseEvent): void {
    event.stopPropagation();
    const curr = this.searchService.getSearchData();
    curr.order_by = orderBy;
    curr.order_direction = orderDirection;
    this.currentOrderBySelected$.next([orderBy, orderDirection]);
    this.isOrderByOpen = false;
    this.search(curr);
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: Event): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.relative')) {
      this.isOrderByOpen = false;
    }
  }
}