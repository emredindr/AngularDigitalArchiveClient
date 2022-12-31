import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { IconsModule } from 'src/app/shared/icons/icons.module';
import { FormsModule } from '@angular/forms';
import { PermissionGroupRoutingModule } from './permission-group-routing.module';
import { PermissionGroupListComponent } from './permission-group-list/permission-group-list.component';
import { PermissionGroupEditModalComponent } from './components/permission-group-edit-modal/permission-group-edit-modal.component';
import { PermissionGroupCreateModalComponent } from './components/permission-group-create-modal/permission-group-create-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
  
    PermissionGroupListComponent,
       PermissionGroupEditModalComponent,
       PermissionGroupCreateModalComponent
  ],
  imports: [
    CommonModule,
    PermissionGroupRoutingModule,
    TableModule,
    PaginatorModule,
    MultiSelectModule,
    FormsModule,
    ModalModule,
    UtilsModule,
    BsDatepickerModule,
    BsDropdownModule,
    IconsModule,
    SharedModule
  ]
})
export class PermissionGroupModule { }
