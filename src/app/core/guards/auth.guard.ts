import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {LocalStorageService} from '@core/services/local-storage.service';
import {constants} from '@shared/constants';
import {AppPath} from '@shared/enums/app-path.enum';

export const authGuard: CanActivateFn = (activatedRoute, routerState) => {
  const localStorageService: LocalStorageService = inject(LocalStorageService);
  const router: Router = inject(Router);

  const isUserAuthorized = !!localStorageService.getItem(constants.localStorage.accessToken);
  if (routerState.url === AppPath.LOGIN) {
    if (isUserAuthorized) {
      router.navigate(['']).then();
      return false;
    }
    return true;
  }

  if (!isUserAuthorized) {
    if (routerState.url !== AppPath.REGISTER) {
      router.navigate([AppPath.LOGIN]).then();
      return false;
    }
  }
  return true;
};
