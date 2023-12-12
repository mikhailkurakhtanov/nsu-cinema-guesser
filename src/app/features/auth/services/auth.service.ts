import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, Observable, tap, throwError} from 'rxjs';

import {AuthData} from '@features/auth/models/auth-data.model';
import {ChangePassword} from '@features/auth/models/change-password-form.model';
import {Login} from '@features/auth/models/login-form.model';
import {Register} from '@features/auth/models/register-form.model';
import {constants} from '@shared/constants';

@Injectable()
export class AuthService {
  private readonly apiUrl: string = `${constants.apiUrl}/auth`;
  private readonly httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}

  authenticate(loginData: Login): Observable<AuthData> {
    return this.http.post<AuthData>(`${this.apiUrl}/authenticate`, loginData, {headers: this.httpHeaders}).pipe(
      tap(response => this.saveAuthData(response)),
      catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.error))),
    );
  }

  sendChangePasswordConfirmationCode(email: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/forgot-password`, {email: email})
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.error))));
  }

  changePassword(formData: ChangePassword): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/set-new-password`, formData)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.error))));
  }

  validateChangePasswordConfirmationCode(email: string, confirmationCode: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/check-pass-reset-code`, {email: email, resetCode: confirmationCode})
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.message))));
  }

  register(registerData: Register): Observable<AuthData> {
    return this.http.post<AuthData>(`${this.apiUrl}/register`, registerData, {headers: this.httpHeaders}).pipe(
      tap(response => this.saveAuthData(response)),
      catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.error))),
    );
  }

  logout(): void {
    localStorage.removeItem(constants.localStorage.accessToken);
    localStorage.removeItem(constants.localStorage.refreshToken);

    sessionStorage.removeItem(constants.localStorage.accessToken);
    sessionStorage.removeItem(constants.localStorage.refreshToken);
  }

  private saveAuthData(authData: AuthData): void {
    localStorage.setItem(constants.localStorage.accessToken, authData.accessToken);
    localStorage.setItem(constants.localStorage.refreshToken, authData.refreshToken);
  }

  private showErrorMessage = (message: string) => this.snackBar.open(message, undefined, {duration: constants.defaultSnackBarDuration});
}
