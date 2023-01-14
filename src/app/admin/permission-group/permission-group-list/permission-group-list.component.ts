import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Breadcrumb } from 'src/app/shared/models/navigation.model';
import { PrimengTableHelper } from 'src/shared/helpers/PrimengTableHelper';
import { GetAllPermissionGroupInfo, PermissionGroupService } from 'src/shared/services/permission-group.service';
import Swal from 'sweetalert2';
import { PermissionGroupCreateModalComponent } from '../components/permission-group-create-modal/permission-group-create-modal.component';
import { PermissionGroupEditModalComponent } from '../components/permission-group-edit-modal/permission-group-edit-modal.component';

@Component({
  selector: 'app-permission-group-list',
  templateUrl: './permission-group-list.component.html',
  styleUrls: ['./permission-group-list.component.scss']
})
export class PermissionGroupListComponent implements OnInit {
  @ViewChild('permissionGroupEditModal') permissionGroupEditModal: PermissionGroupEditModalComponent;
  @ViewChild('permissionGroupCreateModal') permissionGroupCreateModal: PermissionGroupCreateModalComponent;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  breadcrumbs: Breadcrumb[] = [];
  
  _primengTableHelper: PrimengTableHelper;
  searchText: string = '';
  permissionGroupList: GetAllPermissionGroupInfo[] = [];
  loading: boolean;

  constructor(private _permissionGroupService:PermissionGroupService) { 
    this._primengTableHelper = new PrimengTableHelper();
  }
  
  loadPermissionGroups(event: LazyLoadEvent) {
    if (this._primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.loading = true;
    let skipCount = this._primengTableHelper.getSkipCount(
      this.paginator,
      event
    );
    let maxResultCount = this._primengTableHelper.getMaxResultCount(
      this.paginator,
      event
    );
    this._permissionGroupService
      .getAllPermissionGroupByPage(this.searchText, skipCount, maxResultCount)
      .subscribe(
        (response) => {
          this.permissionGroupList = response.items as GetAllPermissionGroupInfo[];
          this._primengTableHelper.totalRecordsCount = response.totalCount;
          this.loading = false;
        },
        (responseError) => {
          console.log(responseError);
          this.loading = false;
        }
      );
  }

  deletePermissionGroup(permissionGroupId: number) {
    this.loading = true;

    this._permissionGroupService.deletePermissionGroup(permissionGroupId).subscribe(
      (response) => {
        this.reloadPage();
        this.loading = false;
      },
      (responseError) => {
        console.log(responseError);
        this.loading = false;
      }
    );
  }
  
  confirmDeletePermissionGroup(permissionGroupId: number) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deletePermissionGroup(permissionGroupId);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }
  showCreatePermissionGroupModal(){
    this.permissionGroupCreateModal.show();
  }
  showEditPermissionGroupModal(permissionGroupId:number){
    this.permissionGroupEditModal.show(permissionGroupId);
  }
  loadBreadcrumbs() {
    this.breadcrumbs.push(
      { text: "Ana Sayfa", active: false, link: "/main/home/dashboard" },
      { text: "Yetki Group Listeleri", active: true });
  }
  ngOnInit(): void {
    this.loadBreadcrumbs();
  }

}
