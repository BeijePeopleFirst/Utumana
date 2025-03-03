import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() draggable: boolean = false;
  @Output() dragStart = new EventEmitter<{draft: AccommodationDTO, event: DragEvent}>();
  
  constructor(
    private router: Router
  ){}

  ngOnInit(): void {
  }

  onClick(event: Event): void {
    event.stopImmediatePropagation();
    this.router.navigate([`/create/address/${this.accommodation.id}`]);
  }

  onDragStart(draft:AccommodationDTO, event: DragEvent): void {
    if (this.draggable) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(draft));
      this.dragStart.emit({draft, event});
    }
  }
}
