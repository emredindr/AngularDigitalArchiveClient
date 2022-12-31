import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CreatePermissionGroupInput, PermissionGroupService } from 'src/shared/services/permission-group.service';

@Component({
  selector: 'app-permission-group-create-modal',
  templateUrl: './permission-group-create-modal.component.html',
  styleUrls: ['./permission-group-create-modal.component.scss']
})
export class PermissionGroupCreateModalComponent implements OnInit {
  @ViewChild('permissionGroupCreateModal') permissionGroupCreateModal: ModalDirective;
  @Output() modalSave:EventEmitter<any>=new EventEmitter<any>(); 
  @Input() modalTitle:string="";
  permissionGroupInput:CreatePermissionGroupInput= new CreatePermissionGroupInput();
  loading: boolean;
  constructor(private _permissionGroupService:PermissionGroupService) { }

  hide(){
    this.permissionGroupCreateModal.hide();
  }
  show(){
    this.clearInputs();
    this.permissionGroupCreateModal.show();
  }
  createPermissionGroup(){
    this.loading = true;
    this._permissionGroupService.createPermissionGroup(this.permissionGroupInput).subscribe(response => {
     
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
    this.permissionGroupInput=new CreatePermissionGroupInput();
  }
  ngOnInit(): void {
  }

}
