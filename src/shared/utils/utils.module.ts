import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from './validation-messages.component';
import { MessageService } from 'primeng/api';



@NgModule({
  declarations: [
    ValidationMessagesComponent
  ],
  imports: [
    CommonModule
  ],
  providers:
  [
    MessageService
  ],
  exports:[ValidationMessagesComponent]
})
export class UtilsModule { }
