import {Component, HostListener, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

import {NgOnDestroy} from '@core/services/ng-on-destroy.service';
import {AuthService} from '@features/auth/services/auth.service';
import {constants} from '@shared/constants';
import {AppPath} from '@shared/enums/app-path.enum';

@Component({
  selector: 'cinema-guesser-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [NgOnDestroy],
})
export class HeaderComponent implements OnInit {
  windowWidth!: number;

  @HostListener('window:resize') refreshWindowWidth = () => (this.windowWidth = window.innerWidth);

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.refreshWindowWidth();
  }

  logout(): void {
    this.authService.logout();
    this.router
      .navigate([AppPath.LOGIN])
      .then(() => this.snackBar.open('Вы вышли из учетной записи', undefined, {duration: constants.defaultSnackBarDuration}));
  }
}
