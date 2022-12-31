import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetAllPermissionGroupInfo, PermissionGroupService } from 'src/shared/services/permission-group.service';
import { PermissionService, UpdatePermissionInput } from 'src/shared/services/permission.service';
import { NzSelectSizeType } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-permission-edit-modal',
  templateUrl: './permission-edit-modal.component.html',
  styleUrls: ['./permission-edit-modal.component.scss']
})
export class PermissionEditModalComponent implements OnInit {
  @ViewChild('permissionEditModal') permissionEditModal: ModalDirective;
  @Output() modalSave:EventEmitter<any>=new EventEmitter<any>(); 
  @Input() modalTitle:string="";
  size: NzSelectSizeType = 'default';

  loading: boolean;
  permissionInput:UpdatePermissionInput=new UpdatePermissionInput();
  permissionGroupList: GetAllPermissionGroupInfo[] = [];
  constructor(private _permissionService:PermissionService,private _permissionGroupService:PermissionGroupService ) { }

  show(permissionId:number) {
    this.getPermissionGroupList();
    this.getPermissionById(permissionId);
    this.permissionEditModal.show();
  }
  hide() {
    this.permissionEditModal.hide();
  }
  getPermissionById(permissionId:number){
    this.loading = true;
    
    this._permissionService.getPermissionById(permissionId).subscribe(response => {
     
      this.permissionInput =new UpdatePermissionInput();
      this.permissionInput.name=response.name;
      this.permissionInput.id=response.id;
      this.permissionInput.description=response.description;
      this.permissionInput.permissionGroupId=response.permissionGroupId;

      this.loading = false;

    }, responseError => {
      
      console.log(responseError);
      this.loading = false;
      
    })
  }
  updatePermission(){
    this.loading = true;
    
    this._permissionService.updatePermission(this.permissionInput).subscribe(response => {
     
      this.permissionInput=new UpdatePermissionInput();
      this.hide();
      this.modalSave.emit();
      
      this.loading = false;

    }, responseError => {
      
      console.log(responseError);
      this.loading = false;
      
    })
  }

  getPermissionGroupList() {
    this.loading = true;
    this._permissionGroupService.getPermissionGroupList().subscribe(response => {

      this.permissionGroupList = response.items as GetAllPermissionGroupInfo[];

      this.loading = false;

    }, responseError => {

      console.log(responseError);
      this.loading = false;

    })
  }
  ngOnInit(): void {
  }
}
