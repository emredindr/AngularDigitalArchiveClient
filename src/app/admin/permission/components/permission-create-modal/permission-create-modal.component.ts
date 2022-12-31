import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetAllPermissionGroupInfo, PermissionGroupService } from 'src/shared/services/permission-group.service';
import { CreatePermissionInput, GetAllPermissionInfo, PermissionService } from 'src/shared/services/permission.service';

@Component({
  selector: 'app-permission-create-modal',
  templateUrl: './permission-create-modal.component.html',
  styleUrls: ['./permission-create-modal.component.scss']
})
export class PermissionCreateModalComponent implements OnInit {
  @ViewChild('permissionCreateModal') permissionCreateModal: ModalDirective;
  @Output() modalSave:EventEmitter<any>=new EventEmitter<any>(); 
  @Input() modalTitle:string="";
 

  permissionInput:CreatePermissionInput=new CreatePermissionInput();
  loading: boolean;
  permissionGroupList: GetAllPermissionGroupInfo[] = [];
  selectedPermissionGroup: GetAllPermissionGroupInfo;

  constructor(private _permissionService:PermissionService,private _permissionGroupService:PermissionGroupService ) { }

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
  onChangePermissionGroup(value: GetAllPermissionGroupInfo){

  }
  show() {
    this.clearInputs();
    this.getPermissionGroupList();
    this.permissionCreateModal.show(); 
  }
  createPermission(){
    this.loading = true;
    if (!this.selectedPermissionGroup)
      return;
    this.permissionInput.permissionGroupId=this.selectedPermissionGroup?.id;
    this._permissionService.createPermission(this.permissionInput).subscribe(response => {
     
      this.clearModal();
      
      this.loading = false;

    }, responseError => {
      
      console.log(responseError);
      this.loading = false;
      
    })
  }

  hide() {
    this.permissionCreateModal.hide();
  }
  clearModal(){
    this.clearInputs();
      this.hide();
      this.modalSave.emit();
  }
  clearInputs(){
    this.permissionInput=new CreatePermissionInput();
  }
  ngOnInit(): void {
  }

}
