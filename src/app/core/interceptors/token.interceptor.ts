import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, Observable, throwError} from 'rxjs';

import {AuthService} from '@features/auth/services/auth.service';
import {constants} from '@shared/constants';
import {AppPath} from '@shared/enums/app-path.enum';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  intercept(initialRequest: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string | null = localStorage.getItem(constants.localStorage.accessToken);
    const httpRequest: HttpRequest<unknown> = token ? this.addToken(initialRequest, token) : initialRequest;

    return next.handle(httpRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            return this.handle401Error(error);
          default:
            // this.errorHandlerService.handleError(error);
            return throwError(() => error);
        }
      }),
    );
  }

  addToken(httpRequest: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return httpRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  handle401Error(error: HttpErrorResponse): Observable<never> {
    this.authService.logout();
    this.router.navigate([AppPath.LOGIN]).then();

    return throwError(() => error);
  }
}
