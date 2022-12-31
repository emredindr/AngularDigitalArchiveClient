import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CategoryTypeService, GetAllCategoryTypeInfo } from 'src/shared/services/category-type.service';
import { CategoryService, GetAllCategoryInfo, UpdateCategoryInput } from 'src/shared/services/category.service';

@Component({
  selector: 'app-category-edit-modal',
  templateUrl: './category-edit-modal.component.html',
  styleUrls: ['./category-edit-modal.component.scss']
})
export class CategoryEditModalComponent implements OnInit {

  @ViewChild('categoryEditModal') categoryEditModal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() modalTitle: string = "";

  categoryInput: UpdateCategoryInput = new UpdateCategoryInput();
  loading: boolean;
  categoryTypeList: GetAllCategoryTypeInfo[] = [];
  parentCategoryList: GetAllCategoryInfo[] = [];
  selectedParentCategory: GetAllCategoryInfo | undefined;
  selectedCategoryType: GetAllCategoryTypeInfo | undefined;

  constructor(private _categoryService: CategoryService,
    private _categoryTypeService: CategoryTypeService) { }

  show(categoryId: number) {
    this.getCategoryTypeList();
    this.getCategoryById(categoryId);
    this.categoryEditModal.show();
  }
  hide() {
    this.categoryEditModal.hide();
  }

  getCategoryList(searchText: string | undefined, categoryTypeId: number | undefined, parentCategoryId: number | undefined) {
    this.loading = true;
    this._categoryService.getCategoryList(searchText, categoryTypeId, parentCategoryId).subscribe(response => {

      this.parentCategoryList = response.items as GetAllCategoryInfo[];

      this.selectedParentCategory = this.parentCategoryList.find(x => x.id == this.categoryInput.parentCategoryId);

      this.loading = false;

    }, responseError => {

      console.log(responseError);
      this.loading = false;

    })
  }
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
  getCategoryById(categoryId: number) {
    this.loading = true;
    
    this._categoryService.getCategoryById(categoryId).subscribe(response => {

      this.categoryInput.name = response.name;
      this.categoryInput.id = response.id;
      this.categoryInput.categoryTypeId = response.categoryTypeId;
      this.categoryInput.parentCategoryId = response.parentCategoryId;

      this.selectedCategoryType = this.categoryTypeList.find(x => x.id == response.categoryTypeId);

      this.getCategoryList(undefined, (response.categoryTypeId - 1), undefined);


    }, responseError => {

      console.log(responseError);
      this.loading = false;

    })
  }
  updateCategory() {
    this.loading = true;
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
    this._categoryService.updateCategory(this.categoryInput).subscribe(response => {

      this.clearModal();

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
    this.categoryInput = new UpdateCategoryInput();
    this.selectedCategoryType = undefined;
    this.selectedParentCategory = undefined;
  }
  onChangeCategoryType(value: GetAllCategoryTypeInfo) {
    this.selectedParentCategory = undefined;
    if (value && value.id > 1)
      this.getCategoryList(undefined, (value.id - 1), undefined);

  }
  ngOnInit(): void {
  }

}
