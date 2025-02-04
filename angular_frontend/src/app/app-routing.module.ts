import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccommodationCardComponent } from './components/accommodation-card/accommodation-card.component';

const routes: Routes = [
	{path: '', component: AccommodationCardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
