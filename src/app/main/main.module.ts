import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';


import { CategoryModule } from './category/category.module';
import { HomeModule } from './home/home.module';
import { UserDocumentModule } from './user-document/user-document.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    CategoryModule,
    HomeModule,
    UserDocumentModule

  ]
})
export class MainModule { }
