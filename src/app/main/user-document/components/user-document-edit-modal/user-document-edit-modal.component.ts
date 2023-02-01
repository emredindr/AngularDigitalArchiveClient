import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CategoryService, GetAllCategoryInfo } from 'src/shared/services/category.service';
import { GetAllUserDocumentInfo, UpdateUserDocumentInput, UserDocumentService } from 'src/shared/services/user-document.service';
import { GetAllUserInfo, UserService } from 'src/shared/services/user.service';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { UploadedDocumentInfo } from 'src/app/shared/models/uploaded-document.model';

@Component({
  selector: 'app-user-document-edit-modal',
  templateUrl: './user-document-edit-modal.component.html',
  styleUrls: ['./user-document-edit-modal.component.scss']
})
export class UserDocumentEditModalComponent implements OnInit {
  @ViewChild('userDocumentEditModal') userDocumentEditModal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() modalTitle: string = "";
  size: NzSelectSizeType = 'default';
  loading: boolean;

  uploadDocumentUrl: string = "https://localhost:7048/api/Document/UploadDocument";
  userDocumentInput: UpdateUserDocumentInput = new UpdateUserDocumentInput();
  selectedUser: GetAllUserInfo | undefined;
  selectedCategory: GetAllCategoryInfo | undefined;

  userDocument: GetAllUserDocumentInfo = new GetAllUserDocumentInfo;
  userList: GetAllUserInfo[] = [];
  categoryList: GetAllCategoryInfo[] = [];
  uploadedDocuments: UploadedDocumentInfo[] = [];

  constructor(private _userDocumentService: UserDocumentService, private _userService: UserService, private _categoryService: CategoryService) { }


  show(userDocumentId: number) {
    this.clearInputs()
    this.getUserList();
    this.getCategoryList();
    this.getUserDocumentById(userDocumentId);
    this.userDocumentEditModal.show();
  }
  hide() {
    this.userDocumentEditModal.hide();
  }
  getUserDocumentById(userDocumentId: number) {
    this._userDocumentService.getUserDocumentById(userDocumentId).subscribe(response => {

      this.userDocument = response as GetAllUserDocumentInfo;
      this.userDocumentInput.userDocumentId = response.userDocumentId;

      this.userDocumentInput.documentTitle = response.documentTitle;
      this.userDocumentInput.userId = this.userDocument.documentUser.userId;
      this.userDocumentInput.categoryId = this.userDocument.documentCategory.categoryId;

      this.userDocumentInput.documentId=this.userDocument.documentInfo.id;

      let uploadedItem = new UploadedDocumentInfo();
      uploadedItem.documentId = this.userDocument.documentInfo.id;
      uploadedItem.documentName = this.userDocument.documentInfo.name;
      this.uploadedDocuments.push(uploadedItem);

      this.loading = false;

    }, responseError => {

      console.log(responseError);
      this.loading = false;

    })
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
  editUserDocument() {
    this.loading = true;

    this._userDocumentService.updateUserDocument(this.userDocumentInput).subscribe(response => {

      this.loading = false;
      
      this.clearModal() 

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
    this.userDocumentInput=new UpdateUserDocumentInput();
    this.uploadedDocuments=[];
  }
  onChangeUser(value: GetAllUserInfo) {

  }
  onChangeCategory(value: GetAllCategoryInfo) {

  }
  onUploadDocument(event: any) {
    
    if (event.originalEvent.statusText == "OK") {
      let document = event.originalEvent.body.result;
      if (document && document.documentId > 0) {
        this.userDocumentInput.documentId = document.documentId;
        
        this.uploadedDocuments=[];
        let uploadedItem = new UploadedDocumentInfo();
        uploadedItem.documentId = document.documentId;
        uploadedItem.documentName=document.documentName
        this.uploadedDocuments.push(uploadedItem);
      }
    }

  }
  ngOnInit(): void {
  }

}
