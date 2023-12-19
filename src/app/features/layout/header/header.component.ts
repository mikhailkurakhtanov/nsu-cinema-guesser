import {Component, ElementRef, HostListener, OnInit, Self, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {filter, from, takeUntil} from 'rxjs';

import {NgOnDestroy} from '@core/services/ng-on-destroy.service';
import {AuthService} from '@features/auth/services/auth.service';
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

  readonly LevelType = LevelType;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Self() private destroy: NgOnDestroy,
  ) {}

  ngOnInit(): void {
    this.refreshWindowWidth();
  }

  logout(): void {
    from(this.router.navigate([AppPath.LOGIN]))
      .pipe(
        filter(result => result),
        takeUntil(this.destroy),
      )
      .subscribe(() => {
        this.authService.logout();
        this.snackBar.open('Вы вышли из учетной записи');
      });
  }

  navigateToGame(type: LevelType): void {
    const urlPath = `${AppPath.GAME}/${type}`;
    this.router.navigate([this.router.url === urlPath ? '' : urlPath]).then();
  }
}
