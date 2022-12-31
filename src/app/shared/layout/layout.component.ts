import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { sideNavItems, sideNavSections } from '../data/side-nav.data';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit, OnDestroy {
  @Input() static = false;
  @Input() light = false;
  @HostBinding('class.sb-sidenav-toggled') sideNavHidden = false;
  
  subscription: Subscription = new Subscription();
  sideNavItems = sideNavItems;
  sideNavSections = sideNavSections;
  sidenavStyle = 'sb-sidenav-dark';

  constructor(
      public navigationService: NavigationService,
      private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
      if (this.light) {
          this.sidenavStyle = 'sb-sidenav-light';
      }
      this.subscription.add(
          this.navigationService.sideNavVisible$().subscribe(isVisible => {
              this.sideNavHidden = !isVisible;
              this.changeDetectorRef.markForCheck();
          })
      );
  }
  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
}