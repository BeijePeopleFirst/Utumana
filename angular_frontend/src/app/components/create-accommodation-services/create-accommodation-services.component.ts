import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from 'src/app/models/service';
import { NgForm } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap } from 'rxjs';
import { ServiceService } from 'src/app/services/service.service';
import iconURL from 'src/costants';

@Component({
  selector: 'app-create-accommodation-services',
  templateUrl: './create-accommodation-services.component.html',
  styleUrls: ['./create-accommodation-services.component.css']
})
export class CreateAccommodationServicesComponent implements OnInit, OnDestroy {
  services: Service[] = JSON.parse(localStorage.getItem('new_acc_services') || '[]');
  genericError: boolean = false;
  foundServices$!: Observable<Service[]>;
  private searchTerms = new Subject<string>();
  iconUrl: string = iconURL;

  constructor(
    private router: Router,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.foundServices$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.serviceService.searchServices(term).pipe(
        map(res => {
          if('message' in res){
            console.log(res);
            return [];
          } else {
            return res.filter((service: Service) => !this.services.find((s: Service) => s.id === service.id));
          }
        })
      )));
  }

  ngOnDestroy(): void {
    this.saveServices();
  }

  saveServices(): void{
    localStorage.setItem('new_acc_services', JSON.stringify(this.services));
    // TODO
    // save services in accommodation draft in db ??
  }

  saveAndContinue(): void{
    this.router.navigate(['/create/availabilities']);
  }

  goBack(): void{
    this.router.navigate(['/create/address']);
  }

  addService(found: Service): void{
    this.services.push(found);
  }

  search(searchText: string): void{
    this.searchTerms.next(searchText);
  }
}
