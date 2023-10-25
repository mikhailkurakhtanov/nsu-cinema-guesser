import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, Observable, tap, throwError} from 'rxjs';

import {constants} from '@shared/constants';
import {LoginForm} from '@shared/models/form/login-form.model';
import {Nullable} from '@shared/types';

@Injectable()
export class AuthService {
  private readonly apiUrl: string = constants.apiUrl;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}

  getAccessToken(): Nullable<string> {
    return localStorage.getItem(constants.localStorage.accessToken);
  }

  authorize(formData: LoginForm): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/login`, formData).pipe(
      tap(token => {
        localStorage.setItem(constants.localStorage.accessToken, token);
      }),
      catchError((error: HttpErrorResponse) =>
        throwError(() => this.snackBar.open(error.message, 'OK', {duration: 3000})),
      ),
    );
  }
}
