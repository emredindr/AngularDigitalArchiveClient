import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UploadedDocumentInfo } from 'src/app/shared/models/uploaded-document.model';
import { environment } from 'src/environments/environment';
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

  uploadDocumentUrl: string = environment.baseUrl + "/api/Document/UploadDocumentToAzure";
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

    });
  }

  getCategoryList() {

    this.loading = true;
    this._categoryService.getCategoryList(undefined, undefined, undefined).subscribe(response => {

      this.categoryList = response.items as GetAllCategoryInfo[];

      this.loading = false;

    });
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

    });
  }

  myUploader(event: any) {

    console.log(event);
    this.upload(event.files[0]);
  }

  upload(file: File): void {

    var xhr = this.createCORSRequest('POST', this.uploadDocumentUrl);

    const fd = new FormData();
    fd.append('file', file);

    xhr.send(fd);

  }

  createCORSRequest(method: string, url: string) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        let response = JSON.parse(xhr.responseText);
        if (!response?.isError && response?.result?.documentId > 0) {
          this.uploadedDocumentId = response?.result?.documentId;

          let uploadedItem = new UploadedDocumentInfo();
          uploadedItem.documentId = response?.result?.documentId;
          uploadedItem.documentName = response?.result?.documentName
          this.uploadedDocuments.push(uploadedItem);

        } else
          alert("Dosya yükleme sırasında hata oluştu");
      }
    }
    xhr.open(method, url, true);
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");

    return xhr;
  }

  ngOnInit(): void {
  }
}
