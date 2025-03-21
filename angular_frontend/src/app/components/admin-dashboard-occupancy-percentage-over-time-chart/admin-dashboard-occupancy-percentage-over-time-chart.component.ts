import { Component, Input, OnInit } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-admin-dashboard-occupancy-percentage-over-time-chart',
  templateUrl: './admin-dashboard-occupancy-percentage-over-time-chart.component.html',
  styleUrls: ['./admin-dashboard-occupancy-percentage-over-time-chart.component.css']
})
export class AdminDashboardOccupancyPercentageOverTimeChartComponent {

  @Input() single!: {
    name: string,
    value: any
  }[];

  view: [number, number] = [1500, 600];

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;

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

  constructor() {
    //Object.assign(this, { single });
  }

  onSelect(event: any) {
    console.log(event);
  }

}
