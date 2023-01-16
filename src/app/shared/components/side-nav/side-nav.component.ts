import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserLoginOutput } from 'src/shared/services/auth.service';
import { AppConsts } from 'src/shared/services/constracts/AppConsts';
import { LocalStorageService } from 'src/shared/services/local-storage.service';
import { SideNavItems, SideNavSection } from '../../models/navigation.model';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {
  @Input() sidenavStyle!: string;
  @Input() sideNavItems!: SideNavItems;
  @Input() sideNavSections!: SideNavSection[];

  userInfo: UserLoginOutput = new UserLoginOutput();
  subscription: Subscription = new Subscription();
  routeDataSubscription!: Subscription;

  constructor(
    public navigationService: NavigationService,
    private _localStorageService: LocalStorageService
  ) { }

  loadUserInfo() {
    let user = this._localStorageService.getItem(AppConsts.lsUser);
    //if(user!=null && user != undifined)
    if (user) this.userInfo = JSON.parse(user) as UserLoginOutput;
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}