import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CreateUserInput, UserService } from 'src/shared/services/user.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-user-create-modal',
  templateUrl: './user-create-modal.component.html',
  styleUrls: ['./user-create-modal.component.scss']
})
export class UserCreateModalComponent implements OnInit {
  @ViewChild('userCreateModal') userCreateModal: ModalDirective;
  @Output() modalSave:EventEmitter<any>=new EventEmitter<any>(); 
  @Input() modalTitle:string="";



  userInput:CreateUserInput=new CreateUserInput();
  loading: boolean;
 
  constructor(private _userService: UserService) { }

  show() {

    this.userCreateModal.show();
    
    
  }
  createUser(){
    this.loading = true;
    // this.userInput.birthDate=undefined;s
    this._userService.createUser(this.userInput).subscribe(response => {
     
      this.clearModal();
      
      this.loading = false;

    }, responseError => {
      
      console.log(responseError);
      this.loading = false;
      
    })
  }

  hide() {
    this.userCreateModal.hide();
  }

  clearModal(){
    this.userInput=new CreateUserInput();
      this.hide();
      this.modalSave.emit();
  }
  ngOnInit(): void {
  }

}
