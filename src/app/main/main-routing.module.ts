import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from '../shared/layout/layout.component';

const categoryModule = () => import('./category/category.module').then(x => x.CategoryModule);
const homeModule = () => import('./home/home.module').then(x => x.HomeModule);
const userDocumentModule = () => import('./user-document/user-document.module').then(x => x.UserDocumentModule);


const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'category', loadChildren: categoryModule },
      { path: 'home', loadChildren: homeModule },
      { path: 'user-document', loadChildren: userDocumentModule },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
