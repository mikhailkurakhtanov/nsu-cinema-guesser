import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {min} from 'rxjs';

@Component({
  selector: 'cinema-guesser-features-game-stopwatch',
  templateUrl: './stopwatch.component.html',
})
export class StopwatchComponent implements AfterViewInit, OnDestroy {
  seconds = 0;
  minutes = 0;
  hours = 0;

  interval?: number;

  ngAfterViewInit(): void {
    this.interval = setInterval(() => {
      this.seconds++;

      if (this.seconds === 60) {
        this.minutes++;
        this.seconds = 0;
      }

      if (this.minutes === 60) {
        this.hours++;
        this.minutes = 0;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval as number);
  }

  protected readonly min = min;
}
