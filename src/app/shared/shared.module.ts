import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from "ngx-toastr";
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { NavigationService } from './services/navigation.service';
import { SideNavService } from './services/side-nav.service';
import { SideNavItemComponent } from './components/side-nav-item/side-nav-item.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { TopNavUserComponent } from './components/top-nav-user/top-nav-user.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { IconsModule } from './icons/icons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/footer/footer.component';


@NgModule({
  declarations: [
    LayoutComponent,
    SideNavComponent,
    SideNavItemComponent,
    TopNavComponent,
    TopNavUserComponent,
    BreadcrumbsComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ToastrModule.forRoot({
      positionClass: "toast-bottom-right"
    }),
    RouterModule,
    IconsModule,
    NgbModule
  ],
  exports: [BreadcrumbsComponent],
  providers: [
    NavigationService,
    SideNavService
  ]
})
export class SharedModule { }
