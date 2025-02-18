import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from 'src/app/models/service';
import { FiltersService } from 'src/app/services/filters.service';
import { FilterParams } from 'src/app/models/filterParams';
import iconURL from 'src/costants';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() services: Service[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<FilterParams>();

  iconUrl = iconURL;
  selectedServices: string[];
  filterForm: FormGroup;

  /* constructor(
    private filtersService: FiltersService,
    private fb: FormBuilder
  ) {
    const selectedServices = this.filtersService.getSelectedFilters();
    this.selectedServices = selectedServices;
    
    this.filterForm = this.fb.group({
      minPrice: [''],
      maxPrice: [''],
      minRating: [''],
      maxRating: ['']
    });
  } */
    constructor(private filtersService: FiltersService, private fb: FormBuilder) {
      const selectedServices = this.filtersService.getSelectedFilters();
      this.selectedServices = selectedServices;
      this.filterForm = this.fb.group({
        minPrice: [null, [Validators.min(0)]],
        maxPrice: [null, [Validators.min(0)]],
        minRating: [null, [Validators.min(0), Validators.max(5)]],
        maxRating: [null, [Validators.min(0), Validators.max(5)]]
      }, { validators: this.validateMinMax });
    }
  
    validateMinMax(form: FormGroup) {
      const minPrice = form.get('minPrice')?.value;
      const maxPrice = form.get('maxPrice')?.value;
      const minRating = form.get('minRating')?.value;
      const maxRating = form.get('maxRating')?.value;
  
      const errors: any = {};
  
      if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
        errors.priceInvalid = true;
      }
      if (minRating !== null && maxRating !== null && minRating > maxRating) {
        errors.ratingInvalid = true;
      }
  
      return Object.keys(errors).length ? errors : null;
    }

  ngOnInit(): void {
    this.selectedServices = this.filtersService.getSelectedFilters();
    
    // Inizializza il form con i valori salvati se esistono
    const savedFilters = this.filtersService.getAllFilters();
    if (savedFilters) {
      this.filterForm.patchValue({
        minPrice: savedFilters.min_price,
        maxPrice: savedFilters.max_price,
        minRating: savedFilters.min_rating,
        maxRating: savedFilters.max_rating
      });
    }
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
    const filters: FilterParams = {
      services: this.selectedServices.length > 0 ? Array.from(this.selectedServices) : [],
      min_price: this.filterForm.get('minPrice')?.value || undefined,
      max_price: this.filterForm.get('maxPrice')?.value || undefined,
      min_rating: this.filterForm.get('minRating')?.value || undefined,
      max_rating: this.filterForm.get('maxRating')?.value || undefined
    };

    const cleanedFilters: FilterParams = {};
    if (filters.services?.length) cleanedFilters.services = filters.services;
    if (filters.min_price !== undefined) cleanedFilters.min_price = filters.min_price;
    if (filters.max_price !== undefined) cleanedFilters.max_price = filters.max_price;
    if (filters.min_rating !== undefined) cleanedFilters.min_rating = filters.min_rating;
    if (filters.max_rating !== undefined) cleanedFilters.max_rating = filters.max_rating;

    console.log("cleaned", cleanedFilters);
    this.filtersService.saveAllFilters(cleanedFilters);
    this.apply.emit(cleanedFilters);
    this.close.emit();
  }

  handleMinRatingClick(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const rating = Math.ceil((x / width) * 5);
    this.filterForm.patchValue({ minRating: rating });
  }
  
  handleMaxRatingClick(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const rating = Math.ceil((x / width) * 5);
    this.filterForm.patchValue({ maxRating: rating });
  }

  setMinRating(value: number) {
    this.filterForm.patchValue({ minRating: value });
  }
  
  setMaxRating(value: number) {
    this.filterForm.patchValue({ maxRating: value });
  }
}