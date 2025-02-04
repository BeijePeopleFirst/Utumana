import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      city: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      people: [1, [Validators.required, Validators.min(1)]]
    });
  }

  search() {
    if (this.searchForm.valid) {
      console.log('Dati ricerca:', this.searchForm.value);
    } else {
      console.log('Il form non è valido!');
    }
  }
}
