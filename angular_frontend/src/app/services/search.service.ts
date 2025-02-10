import { Injectable } from '@angular/core';
import { params } from '../models/searchParams';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchData: params = {
    destination: '',
    'check-in': undefined,
    'check-out': undefined,
    number_of_guests: 0,
    free_only: false,
    services: [''],
    order_by: ''
  };

  setSearchData(data: params) {
    this.searchData = data;
  }

  getSearchData() {
    return this.searchData;
  }
}
