import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGroupListComponent } from './permission-group-list/permission-group-list.component';


const routes: Routes = [
  {
    path: 'list', component: PermissionGroupListComponent
  },
  {
    //burası istege bağlı
    path: '', component: PermissionGroupListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionGroupRoutingModule { }
