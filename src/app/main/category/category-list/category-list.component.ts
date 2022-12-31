import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs';
import { Breadcrumb } from 'src/app/shared/models/navigation.model';
import { PrimengTableHelper } from 'src/shared/helpers/PrimengTableHelper';
import { CategoryService, GetAllCategoryInfo } from 'src/shared/services/category.service';
import Swal from 'sweetalert2';
import { CategoryCreateModalComponent } from '../components/category-create-modal/category-create-modal.component';
import { CategoryEditModalComponent } from '../components/category-edit-modal/category-edit-modal.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  @ViewChild('categoryEditModal') categoryEditModal: CategoryEditModalComponent;
  @ViewChild('categoryCreateModal') categoryCreateModal: CategoryCreateModalComponent;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  breadcrumbs: Breadcrumb[] = [];
  _primengTableHelper: PrimengTableHelper;
  searchText: string = '';
  categoryList: GetAllCategoryInfo[] = [];
  loading: boolean;

  constructor(private _categoryService: CategoryService) {
    this._primengTableHelper = new PrimengTableHelper();
  }

  loadCategories(event: LazyLoadEvent) {
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
    this._categoryService
      .getAllCategoryByPage(this.searchText, skipCount, maxResultCount)
      .subscribe(
        (response) => {
          this.categoryList = response.items as GetAllCategoryInfo[];
          this._primengTableHelper.totalRecordsCount = response.totalCount;
          this.loading = false;
        },
        (responseError) => {
          console.log(responseError);
          this.loading = false;
        }
      );
  }
  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }
  deleteCategory(categoryId: number) {
    this._categoryService.deleteCategory(categoryId)
    .pipe(finalize(() => { this.loading = false; }))
      .subscribe(() => { 
        // toast mesaage gösterilecek
        this.reloadPage(); });

  }
  confirmDeleteCategory(categoryId: number) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deleteCategory(categoryId);
      }
    })
  }
  showCreateCategoryModal() {
    this.categoryCreateModal.show();
  }
  showEditCategoryModal(categoryId: number) {
    this.categoryEditModal.show(categoryId);
  }
  loadBreadcrumbs() {
    this.breadcrumbs.push(
      { text: "Ana Sayfa", active: false, link: "/main/home/dashboard" },
      { text: "Kategori Listeleri", active: true });
  }
  ngOnInit() {
    this.loadBreadcrumbs()
   }
}
