import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { DateValidators } from 'src/app/validators/custom_date_validator';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private accommodationService: AccommodationService) {
    this.searchForm = this.fb.group({
      city: [''],
      check_in: [null, Validators.required],
      check_out: [null, Validators.required],
      people: [1, [Validators.required, Validators.min(1)]]
    }, 
    {
/*       validators: [(formGroup: AbstractControl): ValidationErrors | null => {
        return DateValidators.dateRange(
          formGroup.get('check-in')!,
          formGroup.get('check-out')!
        );
      }] */
    });
  }

  search() {
    if (this.searchForm.valid) {
      this.accommodationService.searchAccommodations(this.searchForm.value);
      this.router.navigate(['/search_page']);
    } else {
      console.log('Il form non è valido!');
    }
  }

  getParams(form: FormGroup<any>) {

  }
}
