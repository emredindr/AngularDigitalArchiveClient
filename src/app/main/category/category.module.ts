import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { TableModule } from 'primeng/table';
import { IconsModule } from 'src/app/shared/icons/icons.module';
import { CategoryCreateModalComponent } from './components/category-create-modal/category-create-modal.component';
import { CategoryEditModalComponent } from './components/category-edit-modal/category-edit-modal.component';
import { PaginatorModule } from 'primeng/paginator';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CategoryRoutingModule } from './category-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryCreateModalComponent,
    CategoryEditModalComponent

  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    TableModule,
    PaginatorModule,
    ModalModule,
    UtilsModule,
    BsDropdownModule,
    IconsModule,
    SharedModule
  ]
})
export class CategoryModule { }
