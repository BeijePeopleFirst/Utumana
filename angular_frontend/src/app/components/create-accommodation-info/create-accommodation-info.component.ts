import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DraftService } from 'src/app/services/draft.service';

@Component({
  selector: 'app-create-accommodation-info',
  templateUrl: './create-accommodation-info.component.html',
  styleUrls: ['./create-accommodation-info.component.css']
})
export class CreateAccommodationInfoComponent implements OnInit, OnDestroy {
  draftId: number;
  genericError: boolean = false;
  @ViewChild('infoForm', { static: true }) infoForm!: NgForm;

  title!: string;
  description!: string;
  beds!: number;
  rooms!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private draftService: DraftService
  ) {
    this.draftId = this.route.snapshot.params['draftId'];
  }

  ngOnInit(): void {
    this.draftService.getAccommodationInfo(this.draftId).subscribe(info => {
      if(!info){
        this.genericError = true;
        return;
      }
      this.title = info.title;
      this.description = info.description;
      this.beds = info.beds;
      this.rooms = info.rooms;
      if(!this.beds)  this.beds = 1;
      if(!this.rooms) this.rooms = 1;
    })
  }

  ngOnDestroy(): void {
    this.save();
  }

  save(): void {
    this.draftService.setAccommodationInfo({
      title: this.title, 
      description: this.description, 
      beds: Number(this.beds), 
      rooms: Number(this.rooms)
    }, this.draftId);
  }

  saveAndContinue(): void {
    this.router.navigate(['/create/photos/', this.draftId]);
  }
  goBack(): void{
    this.router.navigate(['/create/availabilities/', this.draftId]);
  }
}
