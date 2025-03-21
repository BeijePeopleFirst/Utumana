import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { BACKEND_URL_PREFIX } from 'src/costants';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardChartsService {

  constructor(private http: HttpClient) { }

  public calculateAveragePricesOverTimeChart(): 
  Observable<
  {
    name: string,
    series: {
      name: string,
      value: any
    }[]
  }[]

  |

  {message: string, status: string, time: string}
  > 
  {
    return this.http.get<
      {
        name: string,
        series: {
          name: string,
          value: any
        }[]
      }[]

      |

      {message: string, status: string, time: string}
      >(
        BACKEND_URL_PREFIX + "/api/accommodations/fetch_price_average_over_time"
      )
      .pipe(
        catchError(
          error => {
            console.error(error.error);
            return of(error.error);
          }
        )
      )  
  }
}
