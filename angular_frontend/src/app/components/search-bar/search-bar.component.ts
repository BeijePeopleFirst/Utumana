import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { SearchService } from 'src/app/services/search.service';
import { DateValidators } from 'src/app/validators/custom_date_validator';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchForm: FormGroup;
  cityValue: string = '';
  check_inValue: Date | null = null;
  check_outValue: Date | null = null;
  peopleValue: number = 1;

  constructor(private fb: FormBuilder, private router: Router, private accommodationService: AccommodationService, private searchService: SearchService) {
    const savedData = this.searchService.getSearchData();
    this.searchForm = this.fb.group({
      city: [savedData?.city || this.cityValue],
      check_in: [savedData?.check_in || this.check_inValue, Validators.required],
      check_out: [savedData?.check_out || this.check_outValue, Validators.required],
      people: [savedData?.people || this.peopleValue, [Validators.required, Validators.min(1)]]
    }/*       validators: [(formGroup: AbstractControl): ValidationErrors | null => {
        return DateValidators.dateRange(
          formGroup.get('check-in')!,
          formGroup.get('check-out')!
        );
      }] */);

  }

  search() {
    if (this.searchForm.valid) {
      const params = this.accommodationService.getParams(this.searchForm.value)
      this.searchService.setSearchData(this.searchForm.value);
      this.router.navigate(['/search_page/'], { queryParams: params });
    } else {
      console.log('Il form non è valido!');
    }
  }


  }  