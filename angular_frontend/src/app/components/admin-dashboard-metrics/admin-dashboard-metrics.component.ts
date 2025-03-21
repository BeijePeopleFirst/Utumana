import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-metrics',
  templateUrl: './admin-dashboard-metrics.component.html',
  styleUrls: ['./admin-dashboard-metrics.component.css']
})
export class AdminDashboardMetricsComponent implements OnInit {

  multi!: {
    name: string,
    series: {
      name: string,
      value: any
    }[]
  }[];


  constructor(
    private route: ActivatedRoute
  )
  {}

  ngOnInit(): void {
    
    this.route.data.subscribe(
      data => {
        this.multi = data["multi"] ? data["multi"] : [];
      }
    )

  }

}
