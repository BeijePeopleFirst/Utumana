import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-create-progress',
  templateUrl: './create-progress.component.html',
  styleUrls: ['./create-progress.component.css']
})
export class CreateProgressComponent {
  @Input() step!: number;
}
