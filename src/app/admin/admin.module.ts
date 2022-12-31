import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { PermissionGroupModule } from './permission-group/permission-group.module';



@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    UserModule,
    PermissionModule,
    PermissionGroupModule,

  ]
})
export class AdminModule { }
