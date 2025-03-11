import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() startDate!: string | Date;

  timeLeft: string = '';
  private intervalId: any;

  ngOnInit(): void {
    console.log(this.startDate)
    if (this.startDate) {
      console.log("dentro if")
      // Initialize the timer immediately
      this.updateTimeLeft();
      this.intervalId = setInterval(() => this.updateTimeLeft(), 1000);
    }
  }

  private updateTimeLeft() {
    const now = new Date().getTime();
    const startDate = new Date(this.startDate);
    const distance = startDate.getTime() - now;

    if (distance < 0) {
      clearInterval(this.intervalId);
      this.timeLeft = '0d 0h 0m 0s';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timeLeft = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
