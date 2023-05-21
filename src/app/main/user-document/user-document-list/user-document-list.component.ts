import { HttpBackend } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MessageService, TreeNode } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Breadcrumb } from 'src/app/shared/models/navigation.model';
import { PrimengTableHelper } from 'src/shared/helpers/PrimengTableHelper';
import { CategoryService, GetAllCategoryInfo } from 'src/shared/services/category.service';
import { GetAllUserDocumentInfo, UserDocumentService } from 'src/shared/services/user-document.service';
import Swal from 'sweetalert2';
import { UserDocumentCreateModalComponent } from '../components/user-document-create-modal/user-document-create-modal.component';
import { UserDocumentEditModalComponent } from '../components/user-document-edit-modal/user-document-edit-modal.component';

@Component({
  selector: 'app-user-document-list',
  templateUrl: './user-document-list.component.html',
  styleUrls: ['./user-document-list.component.scss']
})
export class UserDocumentListComponent implements OnInit {
  @ViewChild('userDocumentEditModal') userDocumentEditModal: UserDocumentEditModalComponent;
  @ViewChild('userDocumentCreateModal') userDocumentCreateModal: UserDocumentCreateModalComponent;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  data:any;
  breadcrumbs: Breadcrumb[] = [];
  _primengTableHelper: PrimengTableHelper;
  searchText: string = '';
  loading: boolean;
  userDocumentList: GetAllUserDocumentInfo[] = [];
  categoryTreeData: TreeNode[] = []
  
  imageBaseUrl:string;
  constructor(private _userDocumentService: UserDocumentService, private _categoryService: CategoryService, private _messageService: MessageService) {
    this._primengTableHelper = new PrimengTableHelper();
  }
  loadUserDocuments(event: LazyLoadEvent) {
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
    this.getAllUserDocumentByPage(undefined, undefined, undefined, skipCount, maxResultCount);
  }
  getAllUserDocumentByPage(searchText: string | undefined, categoryId: number | undefined, userId: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined) {
    this._userDocumentService
      .getAllUserDocumentByPage(searchText, categoryId, userId, skipCount, maxResultCount)
      .subscribe(
        (response) => {
          this.userDocumentList = response.items as GetAllUserDocumentInfo[];
          this._primengTableHelper.totalRecordsCount = response.totalCount;
          this.loading = false;
        });
  }
  reloadPage() {
    this.paginator.changePage(this.paginator.getPage());
  }
  expandAll() {
    this.categoryTreeData.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.categoryTreeData.forEach(node => {
      this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
  loadCategoryTree() {
    this._categoryService
      .getCategoryList(undefined, undefined, undefined)
      .subscribe(
        (response) => {

          let result: TreeNode[] = [];
          let parentCategoryList = response.items?.filter(x => x.parentCategoryId == 0);
          if (!parentCategoryList)
            return;

          parentCategoryList.forEach(element1 => {
            let item: TreeNode = {
              "label": element1.name,
              "data": element1,
              "expandedIcon": "pi pi-folder-open",
              "collapsedIcon": "pi pi-folder",
              "children": []
            };

            let childNode = response.items?.filter(x => x.parentCategoryId == element1.id) as GetAllCategoryInfo[];
            childNode.forEach(element2 => {
              let childItem: TreeNode = {
                "label": element2.name,
                "data": element2,
                "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": []
              };

              let childOfChildNode = response.items?.filter(x => x.parentCategoryId == element2.id) as GetAllCategoryInfo[];
              childOfChildNode.forEach(element3 => {
                let childOfChildItem: TreeNode = {
                  "label": element3.name,
                  "data": element3,
                  "expandedIcon": "pi pi-folder-open",
                  "collapsedIcon": "pi pi-folder",
                  "children": []
                };
                let lastChild = response.items?.filter(x => x.parentCategoryId == element3.id) as GetAllCategoryInfo[];

                lastChild.forEach(element4 => {
                  let lastChildItem: TreeNode = {
                    "label": element4.name,
                    "data": element4,
                    "expandedIcon": "pi pi-folder-open",
                    "collapsedIcon": "pi pi-folder",
                    "children": []
                  };
                  childOfChildItem["children"]?.push(lastChildItem);
                });
                childItem["children"]?.push(childOfChildItem);
              });
              item["children"]?.push(childItem);
            });
            result.push(item);
          });
          this.categoryTreeData = result;

          this.loading = false;
        },
        (responseError) => {
          console.log(responseError);
          this.loading = false;
        }
      );
  }

  nodeSelect(event: any) {
    //this._messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.label});
    if (event.node.data && event.node.data.id) {
      let categoryId = event.node.data.id;
      this.getAllUserDocumentByPage(undefined, categoryId, undefined, undefined, undefined);
    }
  }
  showEditUserDocumentModal(userDocumentId: number) {
    this.userDocumentEditModal.show(userDocumentId);
  }
  

  deleteUserDocument(userDocumentId: number) {
    this.loading = true;

    this._userDocumentService.deleteUserDocument(userDocumentId).subscribe(
      (response) => {
        this.reloadPage();

        this.loading = false;
      }
    );
  }

  confirmDeleteUserDocument(userDocumentId: number) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deleteUserDocument(userDocumentId);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
  previewUserDocument(){
    Swal.fire('Çok yakındaa')
  }
  
  showCreateUserDocumentModal() {
    this.userDocumentCreateModal.show();
  }

  downloadUserDocument(fileName : string){
    //  fetch(this.storageBaseUrl+fileName);
    // // this.storageBaseUrl+fileName
    // this.downloadImage(this.storageBaseUrl+fileName)
  }


  
  loadBreadcrumbs() {
    this.breadcrumbs.push(
      { text: "Ana Sayfa", active: false, link: "/main/home/dashboard" },
      { text: "Kullanıcı Dokümanları", active: true });
  }


  ngOnInit(): void {
    this.loadBreadcrumbs();
    this.loadCategoryTree();
  }

}
