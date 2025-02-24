import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, of, switchMap } from 'rxjs';
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
  foundAccommodationsPageNumber: number = 0;
  foundAccommodationsTotalPages: number = 0;
  foundAccommodationsPageSize: number = 8;
  
  services$ = this.filterService.services$;
  searchParams$ = this.searchService.searchData$;
  currentOrderBySelected$ = new BehaviorSubject<string[]>(['minPrice', 'asc']);
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
    this.route.data.subscribe(data => {
      const accommodations = data['loadSearchAccommodations'].content;

      this.currentOrderBySelected$.next([this.searchService.getSearchData().order_by ?? 'minPrice', this.searchService.getSearchData().order_direction ?? 'asc']);

      this.accommodationService.getPrices(accommodations).subscribe(
        updatedAccommodations => {
          this.foundAccommodations$ = of(updatedAccommodations || []);
          this.foundAccommodationsPageNumber = data['loadSearchAccommodations'].pageable.pageNumber;
          this.foundAccommodationsTotalPages = data['loadSearchAccommodations'].totalPages;
          this.foundAccommodationsPageSize = data['loadSearchAccommodations'].size;
        }
      );
    });

  }

  search(params: CompleteParams): void {
    const currentParams = this.route.snapshot.queryParams;
    const filters = this.filterService.getAllFilters();
    const searchParams: CompleteParams = {
      destination: params.destination,
      ['check-in']: params['check-in'] ?? currentParams['check-in'] ?? '',
      ['check-out']: params['check-out'] ?? currentParams['check-out'] ?? '',
      number_of_guests: params.number_of_guests ?? currentParams['number_of_guests'],
      free_only: params.free_only ?? currentParams['free_only'],
      services: filters.services,
      order_by: params.order_by ?? currentParams['order_by'],
      order_direction: params.order_direction ?? currentParams['order_direction'],
      min_price: filters.min_price,
      max_price: filters.max_price,
      min_rating: filters.min_rating,
      max_rating: filters.max_rating,
      page: params.page || 0,
      size: this.foundAccommodationsPageSize
    };
    const cleanedParams: CompleteParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined)
    );
  
    this.searchService.setSearchData(searchParams);
    this.router.navigate(['/search_page/'], { queryParams: cleanedParams });
  }
  
  onApplyFilters(filters: FilterParams): void {
    const currentSearchParams = this.searchService.getSearchData();
    const updatedParams: CompleteParams = {
      ...currentSearchParams,
      services: filters.services,
      min_price: filters.min_price,
      max_price: filters.max_price,
      min_rating: filters.min_rating,
      max_rating: filters.max_rating,
      page: 0 
    };
    this.search(updatedParams);
  }

  loadFoundResearchPage(pageNumber: number): void {
    this.foundAccommodationsPageNumber = pageNumber;
    const currentParams = this.searchService.getSearchData(); 
    const updatedParams = {
      ...currentParams,
      page: pageNumber
    };
    this.searchService.setSearchData(updatedParams);
    this.router.navigate(['/search_page/'], { queryParams: updatedParams });
  }

  changePage(page: number): void {
    const currentParams = this.searchService.getSearchData();
    const updatedParams = {
      ...currentParams,
      page: page
    };
    this.searchService.setSearchData(updatedParams);
    this.search(updatedParams);
  }

  toggleOrderByMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isOrderByOpen = !this.isOrderByOpen;
  }

  setOrderParam(orderBy: string, orderDirection: string, event: MouseEvent): void {
    event.stopPropagation();
    this.currentOrderBySelected$.next([orderBy, orderDirection]);
    this.isOrderByOpen = false;

    const currentParams = this.searchService.getSearchData();
    currentParams.order_by = orderBy;
    currentParams.order_direction = orderDirection;
    
    this.search(currentParams);
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: Event): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.relative')) {
      this.isOrderByOpen = false;
    }
  }
}