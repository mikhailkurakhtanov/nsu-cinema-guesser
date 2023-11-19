import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'cinema-guesser-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  windowWidth!: number;

  @HostListener('window:resize') refreshWindowWidth = () => (this.windowWidth = window.innerWidth);

  ngOnInit(): void {
    this.refreshWindowWidth();
  }
}
