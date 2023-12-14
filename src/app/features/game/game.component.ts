import {Component, OnInit, Self} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, switchMap, take, takeUntil, tap} from 'rxjs';

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
        if (!param.score) {
          this.router
            .navigate([''])
            .then(() => this.snackBar.open('Игра закончена', undefined, {duration: constants.defaultSnackBarDuration}));
        }

        this.roundInfo.score = param.score;
        if (param.parameter.length) {
          this.receivedTextParams.push(`${localizedParam}: ${param.parameter.join(', ')}`);
        } else {
          this.snackBar.open('Не удалось получить подсказку', undefined, {duration: constants.defaultSnackBarDuration});
        }
      });
  }

  private startGame(): void {
    this.gameService
      .start(this.levelType)
      .pipe(
        map(roundInfo => (this.roundInfo = roundInfo)),
        filter(() => !!this.roundInfo),
        switchMap(() => this.gameService.getAvailableParameters(Number(this.roundInfo.id))),
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
      this.snackBar.open('Выберите вариант ответа', undefined, {duration: constants.defaultSnackBarDuration});
      return;
    }

    this.gameIsLoaded = false;

    this.gameService
      .setAnswer(this.roundInfo.id, this.selectedAnswer)
      .pipe(
        map(result => {
          if (result.right) {
            this.receivedTextParams = [];
            this.roundInfo = result.round;

            this.snackBar.open('Вы угадали!', undefined, {duration: constants.defaultSnackBarDuration});
          } else {
            this.gameIsLoaded = true;
            this.snackBar.open('Неверный ответ. Попробуйте еще раз!', undefined, {duration: constants.defaultSnackBarDuration});
          }

          if (!result.alive) {
            this.router
              .navigate([''])
              .then(() => this.snackBar.open('Игра закончена.', undefined, {duration: constants.defaultSnackBarDuration}));
          }

          return result.alive && result.right;
        }),
        filter(refreshRoundData => refreshRoundData),
        switchMap(() => this.gameService.getAvailableParameters(Number(this.roundInfo.id))),
        map(params => (this.availableParams = params)),
        filter(() => !!this.availableParams.find(param => param === GameParameterType.IMAGES)),
        switchMap(() => this.gameService.getParameter(this.roundInfo.id, GameParameterType.IMAGES)),
        map(param => {
          this.roundInfo.score = param.score;
          this.imageSrc = param.parameter[0];
        }),
        tap(() => {
          this.currentRound++;
          this.selectedAnswer = '';
          this.gameIsLoaded = true;
        }),
        takeUntil(this.destroy),
      )
      .subscribe();
  }
}
