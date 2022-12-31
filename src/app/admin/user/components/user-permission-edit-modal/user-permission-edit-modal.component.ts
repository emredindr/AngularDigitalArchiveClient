import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TreeNode } from 'primeng/api';
import { CreateOrUpdateUserPermissionInput, CreateUserPermissionInput, GetPermissionGroupAndPermissionList, PermissionAndUserInfo, UserPermissionService } from 'src/shared/services/user-permission.service';

@Component({
  selector: 'app-user-permission-edit-modal',
  templateUrl: './user-permission-edit-modal.component.html',
  styleUrls: ['./user-permission-edit-modal.component.scss']
})
export class UserPermissionEditModalComponent implements OnInit {
  @ViewChild('userPermissionEditModal') userPermissionEditModal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() modalTitle: string = "";
  loading: boolean;
  selectedUserPermissionTreeData: TreeNode[] = [];
  userPermissionTreeData: TreeNode[] = []
  selectedUserId: number;
  constructor(private _userPermissionService: UserPermissionService) { }


  hide() {
    this.userPermissionEditModal.hide();
  }
  show(userId: number) {
    this.selectedUserId = userId;
    this.selectedUserPermissionTreeData = [];
    this.loadUserPermission(userId)
    this.userPermissionEditModal.show();

  }
  nodeSelect(event: any) {
    // //this._messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.label});
    // if(event.node.data && event.node.data.id)
    // {
    //   let categoryId=event.node.data.id;
    //   this.getAllUserDocumentByPage(undefined,categoryId,undefined,undefined,undefined);
    // }
    console.log(event);

  }

  loadUserPermission(userId: number) {
    this._userPermissionService.getPermissionGroupAndPermission(userId).subscribe((response) => {

      let result: TreeNode[] = [];

      let permissionGroupList = response.items as GetPermissionGroupAndPermissionList[];
      if (!permissionGroupList)
        return;

      permissionGroupList.forEach(element1 => {
        let item: TreeNode = {
          "label": element1.permissionGroupName,
          "data": element1,
          "expandedIcon": "pi pi-folder-open",
          "collapsedIcon": "pi pi-folder",
          "children": []
        };

        // console.log(element1.permissionList);

        let childNodeList = element1.permissionList as PermissionAndUserInfo[];
        let isCheckedForNodeList = childNodeList.some(x => !x.isChecked);
        if (!isCheckedForNodeList) {
          this.selectedUserPermissionTreeData.push(item);
        }
        childNodeList.forEach(element2 => {
          let childItem: TreeNode = {
            "label": element2.permissionName,
            "data": element2,
            "collapsedIcon": "pi pi-user",
            "children": []
          };

          if (element2.isChecked) {

            this.selectedUserPermissionTreeData.push(childItem)
          }

          item["children"]?.push(childItem);
        });
        

        
        result.push(item);
      });

      this.userPermissionTreeData = result;

      this.loading = false;
    },
      (responseError) => {
        console.log(responseError);
        this.loading = false;
      }
    );
  }

  updateUserPermission() {
    console.log(this.selectedUserPermissionTreeData);
    let selectedPermissionList = this.selectedUserPermissionTreeData.filter(x => x.data instanceof PermissionAndUserInfo);
    console.log(selectedPermissionList);
    
    let input = new CreateOrUpdateUserPermissionInput();
    input.userId = this.selectedUserId;
    input.permissionList=[];

    selectedPermissionList.forEach(item => {
      let pItem = new CreateUserPermissionInput();
      pItem.permissionId = item.data.permissionId;

      input.permissionList?.push(pItem)

    });

    this._userPermissionService.createOrUpdateUserPermission(input).subscribe(
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

  ngOnInit(): void {

  }

}
