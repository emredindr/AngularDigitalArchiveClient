import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginOutput } from 'src/shared/services/auth.service';
import { AppConsts } from 'src/shared/services/constracts/AppConsts';
import { LocalStorageService } from 'src/shared/services/local-storage.service';

@Component({
  selector: 'app-top-nav-user',
  templateUrl: './top-nav-user.component.html',
  styleUrls: ['./top-nav-user.component.scss'],
})
export class TopNavUserComponent implements OnInit {
  userInfo: UserLoginOutput = new UserLoginOutput();
  constructor(
    private _localStorageService: LocalStorageService,
    private router: Router
  ) {}

  logout() {
    this._localStorageService.removeItem(AppConsts.lsToken);
    this._localStorageService.removeItem(AppConsts.lsUser);

    this.router.navigate(['account/login']);
  }
  loadUserInfo() {
    let user = this._localStorageService.getItem(AppConsts.lsUser);
    //if(user!=null && user != undifined)
    if (user) this.userInfo = JSON.parse(user) as UserLoginOutput;
  }
  ngOnInit() {
    this.loadUserInfo();
  }
}
