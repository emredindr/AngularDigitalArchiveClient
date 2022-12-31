import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Breadcrumb } from '../../models/navigation.model';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  // subscription: Subscription = new Subscription();
  @Input() breadcrumbs!: Breadcrumb[];

  constructor(
    //public navigationService: NavigationService
  ) { }
  ngOnInit() {
    // this.subscription.add(
    //     this.navigationService.routeData$().subscribe(routeData => {
    //         this.breadcrumbs = routeData.breadcrumbs;
    //     })
    // );
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
