import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/shared/services/auth-guard.service';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const mainModule = () => import('./main/main.module').then(x => x.MainModule);

const routes: Routes = [
  // { path: '', component: MainComponent, canActivate: [AuthGuardService] },
  { path: 'account', loadChildren: accountModule },
  { path: 'admin', loadChildren: adminModule,canActivate: [AuthGuardService]},
  { path: 'main', loadChildren: mainModule,canActivate: [AuthGuardService]},
  // { path: 'main', loadChildren: mainModule}, //canActivate: [AuthGuardService]
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
