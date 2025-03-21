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
export class AveragePriceChartResolver implements Resolve<
{
  name: string,
  series: {
    name: string,
    value: any
  }[]
}[]

|

null> {

  constructor(
    private chartsService: AdminDashboardChartsService
  )
  {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<
  {
    name: string,
    series: {
      name: string,
      value: any
    }[]
  }[]

  |

  null
  > 
  {
    return this.chartsService.calculateAveragePricesOverTimeChart().pipe(
      map(response => {
        if("message" in response) {
          return null;
        }
        else return response;
      })
    );
  }
}
