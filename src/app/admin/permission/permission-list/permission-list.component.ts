import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs';
import { Breadcrumb } from 'src/app/shared/models/navigation.model';
import { PrimengTableHelper } from 'src/shared/helpers/PrimengTableHelper';
import { GetAllPermissionInfo, PermissionService } from 'src/shared/services/permission.service';
import Swal from 'sweetalert2';
import { PermissionCreateModalComponent } from '../components/permission-create-modal/permission-create-modal.component';
import { PermissionEditModalComponent } from '../components/permission-edit-modal/permission-edit-modal.component';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit {
  @ViewChild('permissionEditModal') permissionEditModal: PermissionEditModalComponent;
  @ViewChild('permissionCreateModal') permissionCreateModal: PermissionCreateModalComponent;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  breadcrumbs: Breadcrumb[] = [];
  _primengTableHelper: PrimengTableHelper;
  searchText: string = '';
  permissionList: GetAllPermissionInfo[] = [];
  loading: boolean = false;

  constructor(private _permissionService: PermissionService) {
    this._primengTableHelper = new PrimengTableHelper();
  }

  loadPermissions(event: LazyLoadEvent) {
    if (this._primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }

    this.loading = true;
    let skipCount = this._primengTableHelper.getSkipCount(this.paginator, event);
    let maxResultCount = this._primengTableHelper.getMaxResultCount(this.paginator, event);

    this._permissionService.getAllPermissionByPage(this.searchText, skipCount, maxResultCount)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(
        (response) => {
          this.permissionList = response.items as GetAllPermissionInfo[];
          this._primengTableHelper.totalRecordsCount = response.totalCount;
        });
  }

  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }

  deletePermission(permissionId: number) {
    this.loading = true;

    this._permissionService.deletePermission(permissionId)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(() => { 
        // toast mesaage gösterilecek
        this.reloadPage(); });
  }

  showCreatePermissionModal() {
    this.permissionCreateModal.show();
  }

  showEditPermissionModal(permissionId: number) {
    this.permissionEditModal.show(permissionId)
  }

  loadBreadcrumbs() {
    this.breadcrumbs.push(
      { text: "Ana Sayfa", active: false, link: "/main/home/dashboard" },
      { text: "Yetki Listeleri", active: true });
  }

  confirmDeletePermission(permissionId: number) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deletePermission(permissionId);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
  
  ngOnInit(): void {
    this.loadBreadcrumbs();
  }
}
