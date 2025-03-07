import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { AdminSearchParams } from 'src/app/models/adminSearchParams';
import { AdminDashboardSearchService } from 'src/app/services/admin-dashboard-search.service';
@Component({
  selector: 'app-admin-dashdoard-search-bar',
  templateUrl: './admin-dashdoard-search-bar.component.html',
  styleUrls: ['./admin-dashdoard-search-bar.component.css']
})
export class AdminDashdoardSearchBarComponent {
  @Output() searchSubmitted = new EventEmitter<AdminSearchParams>();
  constructor(private adminDashboardSearchService: AdminDashboardSearchService) { }

  searchForm = new FormGroup({
    title: new FormControl(''),
    ownerName: new FormControl(''),
    ownerSurname: new FormControl(''),
    city: new FormControl('')
  });

/*   searchForTitles() {
    if(this.searchForm.value.title) {
      this.adminDashboardSearchService.searchForTitles(this.searchForm.value.title);
    } 
  }

  searchForOwner() {
    if(this.searchForm.value.ownerName) {
      this.adminDashboardSearchService.searchForOwner(this.searchForm.value.ownerName);
    }
  } */  

    search() {
      const param: AdminSearchParams = {};

      if(this.searchForm.value.title) {
        param.title = this.searchForm.value.title;
      }
      if(this.searchForm.value.ownerName) {
        param.ownerName = this.searchForm.value.ownerName;
      }
      if(this.searchForm.value.ownerSurname) {
        param.ownerSurname = this.searchForm.value.ownerSurname;
      }
      if(this.searchForm.value.city) {
        param.city = this.searchForm.value.city;
      }

      console.log(param)
      this.searchSubmitted.emit(param);
    }
}
