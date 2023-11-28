import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, Observable, tap, throwError} from 'rxjs';

import {AuthData} from '@features/auth/models/auth-data.model';
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
      catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.message))),
    );
  }

  register(registerData: Register): Observable<AuthData> {
    return this.http.post<AuthData>(`${this.apiUrl}/register`, registerData, {headers: this.httpHeaders}).pipe(
      tap(response => this.saveAuthData(response)),
      catchError((error: HttpErrorResponse) => throwError(() => this.showErrorMessage(error.message))),
    );
  }

  private saveAuthData(authData: AuthData): void {
    localStorage.setItem(constants.localStorage.accessToken, authData.accessToken);
    localStorage.setItem(constants.localStorage.refreshToken, authData.refreshToken);
  }

  private showErrorMessage = (message: string) => this.snackBar.open(message, undefined, {duration: 3000});
}
