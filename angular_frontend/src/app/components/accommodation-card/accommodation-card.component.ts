import { Component, OnInit } from '@angular/core';
import { Accommodation } from 'src/app/models/accommodation';

@Component({
  selector: 'app-accommodation-card',
  templateUrl: './accommodation-card.component.html',
  styleUrls: ['./accommodation-card.component.css']
})
export class AccommodationCardComponent implements OnInit {

  accommodation!: Accommodation;


  constructor() {}

  ngOnInit(): void {
    
  }

}
