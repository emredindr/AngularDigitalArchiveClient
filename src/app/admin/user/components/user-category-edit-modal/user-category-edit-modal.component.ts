import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TreeNode } from 'primeng/api';
import { CategoryAndUserInfo, CreateOrUpdateUserCategoryInput, CreateUserCategoryInput, UserCategoryService } from 'src/shared/services/user-category.service';


@Component({
  selector: 'app-user-category-edit-modal',
  templateUrl: './user-category-edit-modal.component.html',
  styleUrls: ['./user-category-edit-modal.component.scss']
})
export class UserCategoryEditModalComponent implements OnInit {
  @ViewChild('userCategoryEditModal') userCategoryEditModal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() modalTitle: string = "";
  loading: boolean;
  selectedUserCategoryTreeData: TreeNode[] = [];
  userCategoryTreeData: TreeNode[] = [];
  selectedUserId: number;
  constructor(private _userCategoryService:UserCategoryService) { }

  hide(){
    this.userCategoryEditModal.hide();
  }
  show(userId:number){
    this.selectedUserId=userId;
    this.loadUserCategoryTree(userId);
    this.userCategoryEditModal.show();

  }
  updateUserCategory(){
    let selectedPermissionList = this.selectedUserCategoryTreeData;
    let input = new CreateOrUpdateUserCategoryInput ();
    input.userId = this.selectedUserId;
    input.categoryList=[];

    selectedPermissionList.forEach(item => {
      let pItem = new CreateUserCategoryInput();
      pItem.categoryId = item.data.categoryId;

      input.categoryList?.push(pItem)

    });

    this._userCategoryService.createOrUpdateUserCategory(input).subscribe(
      (response) => {
        this.hide();
        this.loading = false;
      },
      (responseError) => {
        console.log(responseError);
        this.loading = false;
      }
    );


  }
  loadUserCategoryTree(userId:number) {
    this._userCategoryService.getCategoryTypeAndCategoryList(userId).subscribe((response) => {
          let result: TreeNode[] = [];

          let parentCategoryList = response.items?.filter(x => x.parentCategoryId == 0);
          if (!parentCategoryList)
            return;

          parentCategoryList.forEach(element1 => {
            let item: TreeNode = {
              "label": element1.categoryName,
              "data": element1,
              "expandedIcon": "pi pi-folder-open",
              "collapsedIcon": "pi pi-folder",
              "children": []
            };

            let childNode = response.items?.filter(x => x.parentCategoryId == element1.categoryId) as CategoryAndUserInfo[];
            childNode.forEach(element2 => {
              let childItem: TreeNode = {
                "label": element2.categoryName,
                "data": element2,
                "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": []
              };

              let childOfChildNode = response.items?.filter(x => x.parentCategoryId == element2.categoryId) as CategoryAndUserInfo[];
              childOfChildNode.forEach(element3 => {
                let childOfChildItem: TreeNode = {
                  "label": element3.categoryName,
                  "data": element3,
                  "expandedIcon": "pi pi-folder-open",
                  "collapsedIcon": "pi pi-folder",
                  "children": []
                };
                let lastChild = response.items?.filter(x => x.parentCategoryId == element3.categoryId) as CategoryAndUserInfo[];

                lastChild.forEach(element4 => {
                  let lastChildItem: TreeNode = {
                    "label": element4.categoryName,
                    "data": element4,
                    "expandedIcon": "pi pi-folder-open",
                    "collapsedIcon": "pi pi-folder",
                    "children": []
                  };
                  
                  if (element4.isChecked) {

                    this.selectedUserCategoryTreeData.push(lastChildItem)
                  }
        
                  childOfChildItem["children"]?.push(lastChildItem);
                });
                
                if (element3.isChecked) {

                  this.selectedUserCategoryTreeData.push(childOfChildItem)
                }
                childItem["children"]?.push(childOfChildItem);
              });
              if (element2.isChecked) {

                this.selectedUserCategoryTreeData.push(childItem)
              }
              item["children"]?.push(childItem);
            });
            if (element1.isChecked) {

              this.selectedUserCategoryTreeData.push(item)
            }
            result.push(item);
          });

          this.userCategoryTreeData = result;

          this.loading = false;
        },
        (responseError) => {
          console.log(responseError);
          this.loading = false;
        }
      );
  }
  ngOnInit(): void {

  }

}
