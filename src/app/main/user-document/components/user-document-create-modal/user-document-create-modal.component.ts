import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UploadedDocumentInfo } from 'src/app/shared/models/uploaded-document.model';
import { CategoryService, GetAllCategoryInfo } from 'src/shared/services/category.service';
import { CreateUserDocumentInput, UserDocumentService } from 'src/shared/services/user-document.service';
import { GetAllUserInfo, UserService } from 'src/shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-document-create-modal',
  templateUrl: './user-document-create-modal.component.html',
  styleUrls: ['./user-document-create-modal.component.scss'],
})
export class UserDocumentCreateModalComponent implements OnInit {
  @ViewChild('userDocumentCreateModal') userDocumentCreateModal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() modalTitle: string = "";
  uploadDocumentUrl: string = "https://localhost:7048/api/Document/UploadDocument";
  userDocumentInput: CreateUserDocumentInput = new CreateUserDocumentInput();
  loading: boolean;
  uploadedDocumentId: number;
  selectedUser: GetAllUserInfo | undefined;
  selectedCategory: GetAllCategoryInfo | undefined;

  uploadedDocuments: UploadedDocumentInfo[] = [];
  userList: GetAllUserInfo[] = [];
  categoryList: GetAllCategoryInfo[] = [];

  constructor(private _userService: UserService, private _categoryService: CategoryService, private _userDocumentService: UserDocumentService) { }

  show() {
    this.clearInputs();
    this.getUserList();
    this.getCategoryList();

    this.userDocumentCreateModal.show();

  }
  hide() {
    this.userDocumentCreateModal.hide();
  }
  onChangeUser(value: GetAllUserInfo) {

  }
  onChangeCategory(value: GetAllCategoryInfo) {

  }
  getUserList() {
    this.loading = true;
    this._userService.getUserList().subscribe(response => {

      this.userList = response.items as GetAllUserInfo[];

      this.loading = false;

    }, responseError => {

      console.log(responseError);
      this.loading = false;

    })
  }
  getCategoryList() {

    this.loading = true;
    this._categoryService.getCategoryList(undefined, undefined, undefined).subscribe(response => {

      this.categoryList = response.items as GetAllCategoryInfo[];

      this.loading = false;

    }, responseError => {

      console.log(responseError);
      this.loading = false;

    })
  }
  clearModal() {
    this.clearInputs();
    this.hide();
    this.modalSave.emit();
  }
  clearInputs() {
    this.selectedCategory = undefined;
    this.selectedUser = undefined;

  }
  createUserDocument() {
    this.loading = true;
    if (!this.selectedCategory)
      return;
    if (!this.selectedUser)
      return;

    this.userDocumentInput.documentId = this.uploadedDocumentId;
    this.userDocumentInput.userId = this.selectedUser.id;
    this.userDocumentInput.categoryId = this.selectedCategory.id;
    this._userDocumentService.createUserDocument(this.userDocumentInput).subscribe(response => {

      this.clearModal();

      this.loading = false;

    }, responseError => {

    
      console.log(responseError);
      this.loading = false;

    })

  }
  onUploadDocument(event: any) {
    console.log(event);
    
    if (event.originalEvent.statusText == "OK") {
      let document = event.originalEvent.body.result;
      if (document && document.documentId > 0) {
        this.uploadedDocumentId = document.documentId;
        
        let uploadedItem = new UploadedDocumentInfo();
        uploadedItem.documentId = document.documentId;
        uploadedItem.documentName=document.documentName
        this.uploadedDocuments.push(uploadedItem);
      }
    }
  }


  showMessage() {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }

  ngOnInit(): void {
  }

}
