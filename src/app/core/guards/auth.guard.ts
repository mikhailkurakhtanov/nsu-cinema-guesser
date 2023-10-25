import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {AuthService} from '@core/services/auth/auth.service';
import {AppPath} from '@shared/enums/app-path.enum';

export const authGuard: CanActivateFn = (activatedRoute, routerState) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const isUserAuthorized = !!authService.getAccessToken();
  if (routerState.url === AppPath.LOGIN) {
    if (isUserAuthorized) {
      router.navigate(['']).then();
      return false;
    }
    return true;
  }

  if (!isUserAuthorized) {
    router.navigate([AppPath.LOGIN]).then();
    return false;
  }
  return true;
};
