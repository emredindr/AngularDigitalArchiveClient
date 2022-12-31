import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserRoutingModule } from './user-routing.module';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserEditModalComponent } from './components/user-edit-modal/user-edit-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UserCreateModalComponent } from './components/user-create-modal/user-create-modal.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { IconsModule } from 'src/app/shared/icons/icons.module';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionListComponent } from '../permission/permission-list/permission-list.component';
import { UserPermissionEditModalComponent } from './components/user-permission-edit-modal/user-permission-edit-modal.component';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { UserCategoryEditModalComponent } from './components/user-category-edit-modal/user-category-edit-modal.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserEditModalComponent,
    UserCreateModalComponent,
    UserPermissionEditModalComponent,
    UserCategoryEditModalComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    TableModule,
    PaginatorModule,
    MultiSelectModule,
    FormsModule,
    ModalModule,
    UtilsModule,
    BsDatepickerModule,
    BsDropdownModule,
    IconsModule,
    TreeModule,
    ButtonModule,
    SharedModule
    
  ]
})
export class UserModule { }
