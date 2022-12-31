import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UpdateUserInput, UserService } from 'src/shared/services/user.service';
import * as _ from 'lodash-es'

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss']
})
export class UserEditModalComponent implements OnInit {
  @ViewChild('userEditModal') userEditModal: ModalDirective;
  @Output() modalSave:EventEmitter<any>=new EventEmitter<any>(); 
  @Input() modalTitle:string="";
  userInput: UpdateUserInput =new UpdateUserInput();
  loading: boolean;
  
  constructor(private _userService: UserService) {
  }
  show(userId:number) {
    this.getUserById(userId);
    this.userEditModal.show();
    
  }

  hide() {
    this.userEditModal.hide();
  }

  updateUser(){
    this.loading = true;
    
    this._userService.updateUser(this.userInput).subscribe(response => {
     
      this.userInput=new UpdateUserInput();
      this.hide();
      this.modalSave.emit();
      
      this.loading = false;

    }, responseError => {
      
      console.log(responseError);
      this.loading = false;
      
    })
  }

  getUserById(userId:number){
    this.loading = true;
    
    this._userService.getUserById(userId).subscribe(response => {
     
      this.userInput =new UpdateUserInput();
      // this.userInput = _.map();
      this.userInput.name=response.name;
      this.userInput.id=response.id;
      this.userInput.surname=response.surname;
      this.userInput.userName=response.userName;
      this.userInput.email=response.email;
      this.userInput.birthDate=response.birthDate;

      this.loading = false;

    }, responseError => {
      
      console.log(responseError);
      this.loading = false;
      
    })
  }

  ngOnInit(): void {
  }

}
