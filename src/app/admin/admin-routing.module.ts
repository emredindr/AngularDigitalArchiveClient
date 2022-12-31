import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from '../shared/layout/layout.component';


const userModule = () => import('./user/user.module').then(x => x.UserModule);
const permissionModule = () => import('./permission/permission.module').then(x => x.PermissionModule);
const permissionGroupModule = () => import('./permission-group/permission-group.module').then(x => x.PermissionGroupModule);

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'user', loadChildren: userModule },
      { path: 'permission', loadChildren: permissionModule },
      { path: 'permission-group', loadChildren: permissionGroupModule },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
