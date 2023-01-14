import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { GetAllUserInfo, UserService } from 'src/shared/services/user.service';
import { UserEditModalComponent } from '../components/user-edit-modal/user-edit-modal.component';
import { UserCreateModalComponent } from '../components/user-create-modal/user-create-modal.component';
import { PrimengTableHelper } from 'src/shared/helpers/PrimengTableHelper';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { UserPermissionEditModalComponent } from '../components/user-permission-edit-modal/user-permission-edit-modal.component';
import { Breadcrumb } from 'src/app/shared/models/navigation.model';
import { UserCategoryEditModalComponent } from '../components/user-category-edit-modal/user-category-edit-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @ViewChild('userEditModal') userEditModal: UserEditModalComponent;
  @ViewChild('userCreateModal') userCreateModal: UserCreateModalComponent;
  @ViewChild('userPermissionEditModal') userPermissionEditModal: UserPermissionEditModalComponent;
  @ViewChild('userCategoryEditModal') userCategoryEditModal: UserCategoryEditModalComponent;

  @ViewChild('dataTable',{static:true}) dataTable: Table;
  @ViewChild('paginator',{static:true}) paginator: Paginator;

  _primengTableHelper:PrimengTableHelper;
  searchText: string = '';
  userList: GetAllUserInfo[] = [];

  breadcrumbs: Breadcrumb[] = [];
  
  loading: boolean=false;

  constructor(private _userService: UserService) {
    this._primengTableHelper=new  PrimengTableHelper();
  }

  loadUsers(event: LazyLoadEvent) {
    if(this._primengTableHelper.shouldResetPaging(event)){
      this.paginator.changePage(0);
      return;
    }

    this.loading = true;
    let skipCount=this._primengTableHelper.getSkipCount(this.paginator,event);
    let maxResultCount=this._primengTableHelper.getMaxResultCount(this.paginator,event);

    this._userService.getAllUsersByPage(this.searchText, undefined, skipCount, maxResultCount).subscribe(
      (response) => {
        this.userList = response.items as GetAllUserInfo[];
        this._primengTableHelper.totalRecordsCount = response.totalCount;
        this.loading = false;
      },
      (responseError) => {
        console.log(responseError);
        this.loading = false;
      }
    );
  }
  reloadPage():void{
this.paginator.changePage(this.paginator.getPage());
  }

  showCreateUserModal() {
    this.userCreateModal.show();
  }
  showEditUserModal(userId: number) {
    this.userEditModal.show(userId);
  }
  showEditUserPermissionModal(userId: number){
    this.userPermissionEditModal.show(userId)
  }
  showEditUserCategoryModal(userId: number){
    this.userCategoryEditModal.show(userId)
  }
  
  deleteUser(userId: number) {
    this.loading = true;

    this._userService.deleteUser(userId).subscribe(
      (response) => {
        this.reloadPage();
        // this.loadUsers();
        this.loading = false;
      },
      (responseError) => {
        console.log(responseError);
        this.loading = false;
      }
    );
  }

  confirmDeleteUser(userId: number) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deleteUser(userId);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
  
  loadBreadcrumbs() {
    this.breadcrumbs.push(
      { text: "Ana Sayfa", active: false, link: "/main/home/dashboard" },
      { text: "Kullanıcı Listeleri", active: true });
  }
  ngOnInit() {
    this.loadBreadcrumbs();
  }
}
