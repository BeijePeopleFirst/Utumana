import { Component, Input } from '@angular/core';
import { Accommodation } from 'src/app/models/accommodation';

@Component({
  selector: 'app-edit-photos-accommodation-details',
  templateUrl: './edit-photos-accommodation-details.component.html',
  styleUrls: ['./edit-photos-accommodation-details.component.css']
})
export class EditPhotosAccommodationDetailsComponent {

  @Input() accomodation!: Accommodation;

}
