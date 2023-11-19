import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable()
export class WebPageService {
  constructor(private title: Title) {}

  setTitle(tabName: string): void {
    this.title.setTitle(`${tabName} | CinemaGuesser`);
  }

  resetTitle(): void {
    this.title.setTitle('CinemaGuesser');
  }
}
