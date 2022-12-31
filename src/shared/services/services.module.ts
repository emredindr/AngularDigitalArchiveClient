import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { LocalStorageService } from './local-storage.service';
import { UserService } from './user.service';
import { PermissionService } from './permission.service';
import { CategoryService } from './category.service';
import { CategoryTypeService } from './category-type.service';
import { UserDocumentService } from './user-document.service';
import { PermissionGroupService } from './permission-group.service';
import { UserPermissionService } from './user-permission.service';
import { UserCategoryService } from './user-category.service';
import { GlobalHttpInterceptorService } from './common/global-http-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  providers: [
    AuthService,
    LocalStorageService,
    AuthGuardService,
    UserService,
    PermissionService,
    CategoryService,
    CategoryTypeService,
    UserDocumentService,
    PermissionGroupService,
    UserPermissionService,
    UserCategoryService,

    
      { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true  }
  ],
  
})
export class ServicesModule { }
