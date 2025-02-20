import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AccommodationService } from 'src/app/services/accommodation.service';

@Component({
  selector: 'app-create-accommodation-address',
  templateUrl: './create-accommodation-address.component.html',
  styleUrls: ['./create-accommodation-address.component.css']
})
export class CreateAccommodationAddressComponent implements OnDestroy {
  address: {street: string, street_number: string, city: string, province: string, country: string, cap: string, notes: string} = JSON.parse(localStorage.getItem('new_acc_address') || '{}');
  genericError: boolean = false;
  @ViewChild('addressForm', { static: true }) addressForm!: NgForm;

  constructor(
    private router: Router,
    private accommodationService: AccommodationService
  ){ }

  ngOnDestroy(): void {
    this.saveAddress();
  }

  saveAddress(): void {
    localStorage.setItem('new_acc_address', JSON.stringify(this.address));
    // TODO
    // save address in accommodation draft in db
  }

  saveAndContinue(): void {
    this.router.navigate(['/create/services']);
  }
}
