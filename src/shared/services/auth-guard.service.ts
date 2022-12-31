import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { isNull, isUndefined } from 'lodash-es'
import { AppConsts } from './constracts/AppConsts';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(
        private router: Router,
        private _localStorageService: LocalStorageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let token = this._localStorageService.getItem(AppConsts.lsToken);
        if (!isNull(token) && !isUndefined(token))
            return true;
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}