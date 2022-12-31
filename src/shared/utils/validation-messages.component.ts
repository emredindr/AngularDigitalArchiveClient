import { Component, Input } from '@angular/core';
import { filter as _filter, find as _find, concat as _concat } from 'lodash-es';


class ErrorDef {

  error: string;

  message: string;

  errorProperty: string;

}



@Component({

  selector: '<validation-messages>',

  template: `

    <div *ngIf="formCtrl.invalid && (formCtrl.dirty || formCtrl.touched)" class="has-danger">

        <div *ngFor="let errorDef of errorDefsInternal">

            <div *ngIf="getErrorDefinitionIsInValid(errorDef)" class="form-control-feedback">

                {{ getErrorDefinitionMessage(errorDef) }}

            </div>

        </div>

    </div>

    `

})

export class ValidationMessagesComponent {

  _errorDefs: ErrorDef[] = [];



  @Input() formCtrl: any;

  @Input() set errorDefs(value: ErrorDef[]) {

    this._errorDefs = value;

  }



  readonly standartErrorDefs: ErrorDef[] = [

    { error: 'required', message: 'Bu alan boş geçilemez' } as ErrorDef,

    { error: 'minlength', message: 'PleaseEnterAtLeastNCharacter', errorProperty: 'requiredLength' } as ErrorDef,

    { error: 'maxlength', message: 'PleaseEnterNoMoreThanNCharacter', errorProperty: 'requiredLength' } as ErrorDef,

    { error: 'email', message: 'InvalidEmailAddress' } as ErrorDef,

    { error: 'pattern', message: 'InvalidPattern', errorProperty: 'requiredPattern' } as ErrorDef

  ];



  get errorDefsInternal(): ErrorDef[] {

    let standarts = _filter(this.standartErrorDefs, (ed) => !_find(this._errorDefs, (edC) => edC.error === ed.error));

    let all = <ErrorDef[]>_concat(standarts, this._errorDefs);



    return all;

  }

  getErrorDefinitionIsInValid(errorDef: ErrorDef): boolean { return !!this.formCtrl.errors[errorDef.error]; }



  getErrorDefinitionMessage(errorDef: ErrorDef): string {

    let errorRequirement = this.formCtrl.errors[errorDef.error][errorDef.errorProperty];

    return !!errorRequirement

      ? errorDef.message

      : errorDef.message;

  }

}