import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDocumentListComponent } from './user-document-list/user-document-list.component';

const routes: Routes = [
  {
    path: 'list', component: UserDocumentListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDocumentRoutingModule {
 }
