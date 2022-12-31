import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CategoryTypeService, GetAllCategoryTypeInfo } from 'src/shared/services/category-type.service';
import { CategoryService, CreateCategoryInput, GetAllCategoryInfo } from 'src/shared/services/category.service';

@Component({
  selector: 'app-category-create-modal',
  templateUrl: './category-create-modal.component.html',
  styleUrls: ['./category-create-modal.component.scss']
})
export class CategoryCreateModalComponent implements OnInit {
  @ViewChild('categoryCreateModal') categoryCreateModal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() modalTitle: string = "";

  categoryInput: CreateCategoryInput = new CreateCategoryInput();
  categoryTypeList: GetAllCategoryTypeInfo[] = [];
  parentCategoryList: GetAllCategoryInfo[] = [];
  loading: boolean;
  selectedCategoryType: GetAllCategoryTypeInfo | undefined;
  selectedParentCategory: GetAllCategoryInfo | undefined;

  constructor(private _categoryService: CategoryService, private _categoryTypeService: CategoryTypeService) { }

  getCategoryTypeList() {
    this.loading = true;
    this._categoryTypeService.getCategoryTypeList().subscribe(response => {

      this.categoryTypeList = response.items as GetAllCategoryTypeInfo[];

      this.loading = false;

    }, responseError => {

      console.log(responseError);
      this.loading = false;

    })
  }
  getCategoryList(searchText: string | undefined, categoryTypeId: number | undefined, parentCategoryId: number | undefined) {
    this.loading = true;
    this._categoryService.getCategoryList(searchText, categoryTypeId, parentCategoryId).subscribe(response => {
      debugger
      this.parentCategoryList = response.items as GetAllCategoryInfo[];

      this.loading = false;

    }, responseError => {

      console.log(responseError);
      this.loading = false;

    })
  }
  show() {
    this.clearInputs();
    this.getCategoryTypeList();
    this.categoryCreateModal.show();
  }
  createCategory() {
    this.loading = true;
    // this.userInput.birthDate=undefined;s
    if (!this.selectedCategoryType)
      return;
    if (this.selectedCategoryType.id == 1) {
      this.categoryInput.parentCategoryId = 0;
    }
    else {
      if (!this.selectedParentCategory)
        return;
      else
        this.categoryInput.parentCategoryId = this.selectedParentCategory.id;
    }
    this.categoryInput.categoryTypeId = this.selectedCategoryType.id;
    this._categoryService.createCategory(this.categoryInput).subscribe(response => {

      this.clearModal();

      this.loading = false;

    }, responseError => {

      console.log(responseError);
      this.loading = false;

    })
  }

  hide() {
    this.categoryCreateModal.hide();
  }
  clearModal() {
    this.clearInputs();
    this.hide();
    this.modalSave.emit();
  }
  clearInputs() {
    this.categoryInput = new CreateCategoryInput();
    this.selectedCategoryType = undefined;
  }
  onChangeCategoryType(value: GetAllCategoryTypeInfo) {
    this.selectedParentCategory = undefined;
    if (value && value.id>1)
      this.getCategoryList(undefined, (value.id - 1), undefined);

  }

  ngOnInit(): void {
  }

}
