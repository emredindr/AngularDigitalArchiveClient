import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionRoutingModule } from './permission-routing.module';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { IconsModule } from 'src/app/shared/icons/icons.module';
import { FormsModule } from '@angular/forms';
import { PermissionEditModalComponent } from './components/permission-edit-modal/permission-edit-modal.component';
import { PermissionCreateModalComponent } from './components/permission-create-modal/permission-create-modal.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    PermissionListComponent,
    PermissionEditModalComponent,
    PermissionCreateModalComponent
  ],
  imports: [
    CommonModule,
    PermissionRoutingModule,
    TableModule,
    PaginatorModule,
    MultiSelectModule,
    FormsModule,
    ModalModule,
    UtilsModule,
    BsDatepickerModule,
    BsDropdownModule,
    IconsModule,
    NzSelectModule,
    SharedModule
  ]
})
export class PermissionModule { }
