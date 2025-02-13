import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  @Input() startDate!:string;

  timeLeft!:string;
  private intervalId: any;

  ngOnInit():void{
    if(this.startDate){
      this.intervalId = setInterval(() => this.updateTimeLeft(), 1000);
    }
  }

  private updateTimeLeft() {
      const now = new Date().getTime();
      const startDate:Date = new Date(this.startDate);
      const distance = startDate.getTime() - now;
  
      if (distance < 0) {
        clearInterval(this.intervalId);
        return;
      }
  
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      this.timeLeft = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

}
