import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDocumentListComponent } from './user-document-list/user-document-list.component';
import { UserDocumentRoutingModule } from './user-document-routing.module';
import { PaginatorModule } from 'primeng/paginator';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { IconsModule } from 'src/app/shared/icons/icons.module';
import { TableModule } from 'primeng/table';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {TreeModule} from 'primeng/tree';
import {ButtonModule} from 'primeng/button';
import { UserDocumentEditModalComponent } from './components/user-document-edit-modal/user-document-edit-modal.component';
import { UserDocumentCreateModalComponent } from './components/user-document-create-modal/user-document-create-modal.component';
import {FileUploadModule} from 'primeng/fileupload';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    UserDocumentListComponent,
    UserDocumentEditModalComponent,
    UserDocumentCreateModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserDocumentRoutingModule,
    TableModule,
    PaginatorModule,
    ModalModule,
    UtilsModule,
    BsDropdownModule,
    IconsModule,
    TreeModule,
    ButtonModule,
    FileUploadModule,
    NzSelectModule
  ]
})
export class UserDocumentModule { }
