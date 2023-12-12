import {Component, OnInit, Self} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {take, takeUntil} from 'rxjs';

import {NgOnDestroy} from '@core/services/ng-on-destroy.service';
import {GameRound} from '@features/game/models/game.model';
import {GameService} from '@features/game/services/game.service';
import {constants} from '@shared/constants';
import {LevelType} from '@shared/enums/level-type.enum';

@Component({
  selector: 'cinema-guesser-game',
  templateUrl: './game.component.html',
  providers: [NgOnDestroy],
})
export class GameComponent implements OnInit {
  roundInfo?: GameRound;

  private levelType!: LevelType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private gameService: GameService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Self() private destroy: NgOnDestroy,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe(params => {
      this.levelType = params.get('mode') as LevelType;
      this.startGame();
    });
  }

  private startGame(): void {
    this.gameService
      .start(this.levelType)
      .pipe(takeUntil(this.destroy))
      .subscribe(roundInfo => (this.roundInfo = roundInfo));
  }

  private confirmAnswer(answer: string): void {}

  endGame(): void {
    if (!this.roundInfo) {
      return;
    }

    this.gameService
      .endGame(this.roundInfo.id)
      .pipe(takeUntil(this.destroy))
      .subscribe(message => this.snackBar.open(message, undefined, {duration: constants.defaultSnackBarDuration}));
  }
}
