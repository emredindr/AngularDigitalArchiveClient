import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, UserLoginInput } from 'src/shared/services/auth.service';
import { AppConsts } from 'src/shared/services/constracts/AppConsts';
import { LocalStorageService } from 'src/shared/services/local-storage.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup ;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private _localStorageService: LocalStorageService,
    private _toastrService: ToastrService) {}



  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ["",Validators.required],
      password:["",Validators.required]
    })
  }

  login() {

    if (this.loginForm.valid) {
      let loginModel = new UserLoginInput();
      loginModel.email = this.loginForm.value.email;
      loginModel.password = this.loginForm.value.password;

      this._authService.authenticate(loginModel).subscribe(response => {
        this._localStorageService.setItem(AppConsts.lsToken, response.token);
        response.token=undefined;
        this._localStorageService.setItem(AppConsts.lsUser, JSON.stringify(response));

        this._toastrService.info(response.userName);
        this.router.navigate(["main/home/dashboard"]); 
      })
    }
  }

}