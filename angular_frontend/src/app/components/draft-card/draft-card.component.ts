import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { AccommodationService } from 'src/app/services/accommodation.service';
import iconURL from 'src/costants';

@Component({
  selector: 'app-draft-card',
  templateUrl: './draft-card.component.html',
  styleUrls: ['./draft-card.component.css']
})
export class DraftCardComponent implements OnInit {
  @Input() accommodation!: AccommodationDTO;
  iconsUrl: string = iconURL;
  genericHouseUrl: string = iconURL + '/house.png';

  constructor(
    private router: Router
  ){}

  ngOnInit(): void {
  }

  onClick(event: Event): void {
    event.stopImmediatePropagation();
    this.router.navigate([`/create/address/${this.accommodation.id}`]);
  }
}
