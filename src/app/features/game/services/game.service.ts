import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, Observable, throwError} from 'rxjs';

import {GameAnswerResult, GameParameter, GameParameterType, GameRound} from '@features/game/models/game.model';
import {constants} from '@shared/constants';
import {LevelType} from '@shared/enums/level-type.enum';
import {Utils} from '@shared/utils';

@Injectable()
export class GameService {
  private readonly apiUrl: string = `${constants.apiUrl}/game`;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}

  start(level: LevelType): Observable<GameRound> {
    const httpParams: HttpParams = Utils.objectToHttpParams({level});
    return this.http
      .get<GameRound>(`${this.apiUrl}/start`, {params: httpParams})
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.error))));
  }

  setAnswer(id: number, answer: string): Observable<GameAnswerResult> {
    const httpParams: HttpParams = Utils.objectToHttpParams({id, answer});
    return this.http
      .get<GameAnswerResult>(`${this.apiUrl}/setAnswer`, {params: httpParams})
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.error))));
  }

  getParameter(id: number, type: GameParameterType): Observable<GameParameter> {
    const httpParams: HttpParams = Utils.objectToHttpParams({id, type});
    return this.http
      .get<GameParameter>(`${this.apiUrl}/getParameter`, {params: httpParams})
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.error))));
  }

  getAvailableParameters(id: number): Observable<GameParameterType[]> {
    const httpParams: HttpParams = Utils.objectToHttpParams({id});
    return this.http
      .get<GameParameterType[]>(`${this.apiUrl}/getAvailableParameters`, {params: httpParams})
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.error))));
  }

  endGame(id: number): Observable<string> {
    const httpParams: HttpParams = Utils.objectToHttpParams({id});
    return this.http
      .get<string>(`${this.apiUrl}/gameEnd`, {params: httpParams})
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.error))));
  }

  private showErrorMessage = (message: string) => this.snackBar.open(message, undefined, {duration: constants.defaultSnackBarDuration});
}
