import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AdminDashboardChartsService } from '../services/admin-dashboard-charts.service';

@Injectable({
  providedIn: 'root'
})
export class OccupancyPercentageChartResolver implements Resolve<{
  name: string,
  value: any
}[]

|

null

> {

  constructor(private chartService: AdminDashboardChartsService) {}

  //TODO: CAMBIARE RETURN TYPE IN BASE AL BACKEND
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{
    name: string,
    value: any
  }[]

  |

  null
  > 
  {
    return this.chartService.calculateAnnualOccupancyPercentage().pipe(

      map(
        response => {
          if("message" in response) {
            return null;
          }
          else return response;
        }
      )
    );

  }
}
