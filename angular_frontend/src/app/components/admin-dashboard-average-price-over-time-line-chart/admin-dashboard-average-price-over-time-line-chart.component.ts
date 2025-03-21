import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ScaleType } from '@swimlane/ngx-charts';
import { AdminDashboardChartsService } from 'src/app/services/admin-dashboard-charts.service';

@Component({
  selector: 'app-admin-dashboard-average-price-over-time-line-chart',
  templateUrl: './admin-dashboard-average-price-over-time-line-chart.component.html',
  styleUrls: ['./admin-dashboard-average-price-over-time-line-chart.component.css']
})
export class AdminDashboardAveragePriceOverTimeLineChartComponent implements OnInit {

  /**
   * EXAMPLE:
   * [
   *    {
   *      name: "Year 2023",
   *      series: [
   *                {
   *                  name: "January",
   *                  value: 3
   *                },
   *                {
   *                  name: "February",
   *                  value: 5
   *                }
   *              ]
   *    },
   *    
   *    {
   *      name: "Year 2024",
   *      series: [
   *                {
   *                  name: "January",
   *                  value: 7
   *                },
   *                {
   *                  name: "February",
   *                  value: 5
   *                }
   *              ]
   *    }
   * ]
   */
  @Input() multi!: {
    name: string,
    series: {
      name: string,
      value: any
    }[]
  }[];

  view: [number, number] = [1500, 600];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    name: 'colorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF5733', '#FF8D1A', '#FFC300', '#FFB533', '#FF1E00',
    '#B33939', '#2E1A47', '#6A1B9A', '#FF5F6D', '#F09A6E',
    '#9C27B0', '#03A9F4', '#673AB7', '#E91E63', '#4CAF50',
    '#8BC34A', '#009688', '#00BCD4', '#FFEB3B', '#CDDC39',
    '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#3F51B5',
    '#9C27B0', '#2196F3', '#8E24AA', '#7B1FA2', '#F44336']
  };
  

  constructor(
    private translate: TranslateService
  ) 
  {}

  ngOnInit(): void {
    
    this.translate.get('admin-dashboard-average-price-over-time-line-chart.x-axis-label').subscribe((res: string) => {
      this.xAxisLabel = res;
    });
    this.translate.get('admin-dashboard-average-price-over-time-line-chart.y-axis-label').subscribe((res: string) => {
      this.yAxisLabel = res;
    });

  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

}
