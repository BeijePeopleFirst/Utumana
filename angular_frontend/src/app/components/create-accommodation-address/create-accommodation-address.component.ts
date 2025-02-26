import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressDTO } from 'src/app/dtos/addressDTO';
import { DraftService } from 'src/app/services/draft.service';

@Component({
  selector: 'app-create-accommodation-address',
  templateUrl: './create-accommodation-address.component.html',
  styleUrls: ['./create-accommodation-address.component.css']
})
export class CreateAccommodationAddressComponent implements OnInit, OnDestroy {
  address!: AddressDTO;
  draftId: number;
  genericError: boolean = false;
  @ViewChild('addressForm', { static: true }) addressForm!: NgForm;

  constructor(
    private router: Router,
    private draftService: DraftService,
    private route: ActivatedRoute
  ){
    this.draftId = this.route.snapshot.params['draftId'];
  }

  ngOnInit(): void {
    this.draftService.getAddress(this.draftId).subscribe(address => {
      if(!address){
        this.genericError = true;
        return;
      }
      console.log("Address", address);
      this.address = address;
    })
  }

  ngOnDestroy(): void {
    this.saveAddress();
  }

  saveAddress(): void {
    console.log("Saving address", this.address);
    this.draftService.setAddress(this.address, this.draftId);
  }

  saveAndContinue(): void {
    this.router.navigate([`/create/services/${this.draftId}`]);
  }
}
