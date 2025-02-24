import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { FiltersService } from 'src/app/services/filters.service';
import { DateValidators } from 'src/app/validators/custom_date_validator';
import { Output, EventEmitter } from '@angular/core';
import { params } from 'src/app/models/searchParams';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  searchForm: FormGroup | any;
  @Output() searchSubmitted = new EventEmitter<params>();
  
  allCities: string[] = []; 
  filteredCities: string[] = []; 

  isDropDownOpen: boolean = false

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private accommodationService: AccommodationService,
  ) {}

  ngOnInit(): void {
    const savedData = this.searchService.getSearchData();
    console.log("saved: ", savedData);

  
    this.searchForm = this.fb.group({
      city: [savedData?.destination || ''],
      check_in: [savedData?.['check-in'] || null, Validators.required],
      check_out: [savedData?.['check-out'] || null, Validators.required],
      people: [savedData?.number_of_guests || 1, [Validators.required, Validators.min(1)]],
      free_only: Boolean(savedData?.free_only ? savedData?.free_only.toString() === 'true' : false)
    }, {
      validators: [(formGroup: AbstractControl): ValidationErrors | null => {
        return DateValidators.dateRange(
          formGroup.get('check_in')!,
          formGroup.get('check_out')!
        );
      }]
    });

    this.searchService.getAllCities().subscribe(
      cities => {
        this.allCities = cities.filter(city => city != null && city !== undefined); 
        this.filteredCities = [...this.allCities]; 
      },
      error => {
        console.error("Error loading cities:", error);
        this.allCities = []; 
        this.filteredCities = [];
      }
    );
    
    this.searchForm.get('city')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(
      (value: string) => {
        if (this.allCities.length > 0) {
          this.filteredCities = this.filter(value);
        }
      }
    );
  }

  search() {
    if (this.searchForm.valid) {
      const params = this.accommodationService.getParams(this.searchForm.value);
      this.searchService.setSearchData(params);
      this.searchSubmitted.emit(params);
    } else {
      console.log('Il form non è valido!');
    }
  }

  toggleIsFree() {
    const currentValue = this.searchForm.get('free_only')?.value;
    this.searchForm.get('free_only')?.setValue(!currentValue);
  }

  private filter(value: string): string[] {
    if (!value) {
      return this.allCities;
    }
    return this.allCities.filter(city => city.toLowerCase().includes(value.toLowerCase()))
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    this.isDropDownOpen = false;
  }
}