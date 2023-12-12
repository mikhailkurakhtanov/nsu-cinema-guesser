import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

import {NgOnDestroy} from '@core/services/ng-on-destroy.service';
import {AuthService} from '@features/auth/services/auth.service';
import {constants} from '@shared/constants';
import {AppPath} from '@shared/enums/app-path.enum';
import {LevelType} from '@shared/enums/level-type.enum';

@Component({
  selector: 'cinema-guesser-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [NgOnDestroy],
})
export class HeaderComponent implements OnInit {
  @ViewChild('showLevelSelector') showLevelSelectorElement!: ElementRef<HTMLButtonElement>;

  windowWidth!: number;

  @HostListener('window:resize') refreshWindowWidth = () => (this.windowWidth = window.innerWidth);

  readonly AppPath = AppPath;
  readonly LevelType = LevelType;

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

  navigateToGame(type: LevelType): void {
    this.router.navigate([`${AppPath.GAME}/${type}`]).then();
  }
}
