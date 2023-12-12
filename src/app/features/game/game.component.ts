import {Component, OnInit, Self} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, switchMap, take, takeUntil} from 'rxjs';

import {NgOnDestroy} from '@core/services/ng-on-destroy.service';
import {GameParameterType, GameRound} from '@features/game/models/game.model';
import {GameService} from '@features/game/services/game.service';
import {constants} from '@shared/constants';
import {LevelType} from '@shared/enums/level-type.enum';

@Component({
  selector: 'cinema-guesser-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [NgOnDestroy],
})
export class GameComponent implements OnInit {
  roundInfo!: GameRound;
  availableParams: GameParameterType[] = [];
  gameIsLoaded = false;

  selectedAnswer = '';
  imageSrc = '';
  currentRound = 1;
  receivedTextParams: string[] = [];

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

  endGame(): void {
    if (!this.roundInfo) {
      return;
    }

    this.gameService
      .endGame(this.roundInfo.id)
      .pipe(takeUntil(this.destroy))
      .subscribe(message => this.snackBar.open(message, undefined, {duration: constants.defaultSnackBarDuration}));
  }

  getParameter(type: GameParameterType, localizedParam: string): void {
    if (!this.roundInfo) {
      return;
    }

    this.gameService
      .getParameter(this.roundInfo.id, type)
      .pipe(takeUntil(this.destroy))
      .subscribe(param => {
        this.roundInfo.score = param.score;

        if (param.parameter.length) this.receivedTextParams.push(`${localizedParam}: ${param.parameter.join(', ')}`);
      });
  }

  private startGame(): void {
    this.gameService
      .start(this.levelType)
      .pipe(
        map(roundInfo => (this.roundInfo = roundInfo)),
        filter(() => !!this.roundInfo),
        switchMap(() => this.gameService.getAvailableParameters(Number(this.roundInfo?.id))),
        map(params => (this.availableParams = params)),
        filter(() => !!this.availableParams.find(param => param === GameParameterType.IMAGES)),
        switchMap(() => this.gameService.getParameter(this.roundInfo.id, GameParameterType.IMAGES)),
        takeUntil(this.destroy),
      )
      .subscribe(param => {
        this.roundInfo.score = param.score;
        this.imageSrc = param.parameter[0];

        this.gameIsLoaded = true;
      });
  }

  confirmAnswer(): void {
    if (!this.roundInfo || !this.selectedAnswer.length) {
      return;
    }

    this.gameService
      .setAnswer(this.roundInfo.id, this.selectedAnswer)
      .pipe(takeUntil(this.destroy))
      .subscribe(result => {
        this.currentRound++;
        this.selectedAnswer = '';

        this.roundInfo = result.round;

        if (result.right) {
          this.snackBar.open('Вы угадали!', undefined, {duration: constants.defaultSnackBarDuration});
        }

        if (!result.alive) {
          this.snackBar.open('Игра закончена', undefined, {duration: constants.defaultSnackBarDuration});
        }
      });
  }
}
