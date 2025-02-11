import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Service } from 'src/app/models/service';
import { FiltersService } from 'src/app/services/filters.service';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() services: Service[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<string[]>();

  selectedServices: string[];

  constructor(private filtersService: FiltersService) {
    const selectedServices = this.filtersService.getSelectedFilters();
    this.selectedServices = selectedServices;
  }

  ngOnInit(): void {
    this.selectedServices = this.filtersService.getSelectedFilters();
  }

  toggleService(service: Service): void {
    if (this.selectedServices.includes(service.id.toString())) {
      this.selectedServices = this.selectedServices.filter(s => s !== service.id.toString());
    } else {
      this.selectedServices.push(service.id.toString());
    }
  }

  isSelected(service: Service): boolean {
    return this.selectedServices.includes(service.id.toString());
  }

  applyFilters(): void {
    const selected = this.selectedServices.length > 0 ? Array.from(this.selectedServices) : [''];
    this.apply.emit(selected);
    this.close.emit();
  }
}