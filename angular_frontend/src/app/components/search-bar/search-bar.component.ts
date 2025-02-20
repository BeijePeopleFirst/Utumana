import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';
import {AccommodationService} from 'src/app/services/accommodation.service';
import { FiltersService } from 'src/app/services/filters.service';
import { DateValidators } from 'src/app/validators/custom_date_validator';
import { Output, EventEmitter } from '@angular/core';
import { params } from 'src/app/models/searchParams';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit{
  searchForm: FormGroup | any;
  @Output() searchSubmitted = new EventEmitter<params>();

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private accommodationService: AccommodationService,
    private filtersService: FiltersService
  ) {} 

  ngOnInit(): void {
    const savedData = this.searchService.getSearchData();
    console.log("saved: ", savedData);
    
    this.searchForm = this.fb.group({
      city: [savedData?.destination || ''],
      check_in: [savedData?.['check-in'] || null, Validators.required],
      check_out: [savedData?.['check-out'] || null, Validators.required],
      people: [savedData?.number_of_guests || 1, [Validators.required, Validators.min(1)]],
      free_only: [savedData?.free_only === true],
    }, {
      validators: [(formGroup: AbstractControl): ValidationErrors | null => {
        return DateValidators.dateRange(
          formGroup.get('check_in')!,
          formGroup.get('check_out')!
        );
      }]
    });

  }

  search() {
    if (this.searchForm.valid) {
      const params = this.accommodationService.getParams(this.searchForm.value);
      const selectedServices = this.filtersService.getSelectedFilters();
/*       if (selectedServices.length > 0) {
        params.services = selectedServices.map(id => id.toString());
      }  */
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
}