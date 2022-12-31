import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PermissionGroupService, UpdatePermissionGroupInput } from 'src/shared/services/permission-group.service';

@Component({
  selector: 'app-permission-group-edit-modal',
  templateUrl: './permission-group-edit-modal.component.html',
  styleUrls: ['./permission-group-edit-modal.component.scss']
})
export class PermissionGroupEditModalComponent implements OnInit {
  @ViewChild('permissionGroupEditModal') permissionGroupEditModal: ModalDirective;
  @Output() modalSave:EventEmitter<any>=new EventEmitter<any>(); 
  @Input() modalTitle:string="";
  permissionGroupInput:UpdatePermissionGroupInput=new UpdatePermissionGroupInput();
  loading:boolean;

  constructor(private _permissionGroupService:PermissionGroupService) { }

  hide(){
    this.permissionGroupEditModal.hide();
  }
  show(permissionGroupId:number){
    this.getPermissionGroupById(permissionGroupId)
    this.permissionGroupEditModal.show();
  }
  getPermissionGroupById(permissionGroupId:number){
    this.loading = true;
    
    this._permissionGroupService.getPermissionGroupById(permissionGroupId).subscribe(response => {
     
      this.clearInputs();
      this.permissionGroupInput.name=response.name;
      this.permissionGroupInput.id=response.id;
      this.permissionGroupInput.description=response.description;
      this.loading = false;

    }, responseError => {
      
      console.log(responseError);
      this.loading = false;
      
    })
  }
  updatePermissionGroup(){
    this.loading = true;
    
    this._permissionGroupService.updatePermissionGroup(this.permissionGroupInput).subscribe(response => {
     
      this.clearModal();
      
      this.loading = false;

    }, responseError => {
      
      console.log(responseError);
      this.loading = false;
      
    })
  }
  clearModal(){
    this.clearInputs();
      this.hide();
      this.modalSave.emit();
  }
  clearInputs(){
    this.permissionGroupInput =new UpdatePermissionGroupInput();
  }
  ngOnInit(): void {
  }

}
