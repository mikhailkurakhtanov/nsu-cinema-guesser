import {Component, OnInit} from '@angular/core';

import {WebPageService} from '@core/services/web-page.service';

@Component({
  selector: 'cinema-guesser-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  constructor(private webPageService: WebPageService) {}

  ngOnInit(): void {
    this.webPageService.setTitle('Главная');
  }
}
