import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { blobToText, throwException } from './common/extension.service';
import { AppConsts } from './constracts/AppConsts';
import { LocalStorageService } from './local-storage.service';


export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable()
export class UserPermissionService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient,private _localStorageService:LocalStorageService, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = "https://localhost:7048"
    }

    /**
     * @param userId (optional) 
     * @return Success
     */
    getPermissionGroupAndPermission(userId: number | undefined): Observable<GetPermissionGroupAndPermissionListListResult> {
        let url_ = this.baseUrl + "/api/UserPermission/GetPermissionGroupAndPermission?";
        if (userId === null)
            throw new Error("The parameter 'userId' cannot be null.");
        else if (userId !== undefined)
            url_ += "userId=" + encodeURIComponent("" + userId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain",
              "Authorization":`Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetPermissionGroupAndPermission(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetPermissionGroupAndPermission(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetPermissionGroupAndPermissionListListResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetPermissionGroupAndPermissionListListResult>;
        }));
    }

    protected processGetPermissionGroupAndPermission(response: HttpResponseBase): Observable<GetPermissionGroupAndPermissionListListResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetPermissionGroupAndPermissionListListResult.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetPermissionGroupAndPermissionListListResult>(null as any);
    }

     /**
     * @param body (optional) 
     * @return Success
     */
      createOrUpdateUserPermission(body: CreateOrUpdateUserPermissionInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/UserPermission/CreateOrUpdateUserPermission";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization":`Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processCreateOrUpdateUserPermission(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateUserPermission(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processCreateOrUpdateUserPermission(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(null as any);
    }
}

export interface IGetPermissionGroupAndPermissionList {
  permissionGroupId: number;
  permissionGroupName: string | undefined;
  permissionList: PermissionAndUserInfo[] | undefined;
}

export class GetPermissionGroupAndPermissionListListResult implements IGetPermissionGroupAndPermissionListListResult {
  items!: GetPermissionGroupAndPermissionList[] | undefined;

  constructor(data?: IGetPermissionGroupAndPermissionListListResult) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          if (Array.isArray(_data["items"])) {
              this.items = [] as any;
              for (let item of _data["items"])
                  this.items!.push(GetPermissionGroupAndPermissionList.fromJS(item));
          }
      }
  }

  static fromJS(data: any): GetPermissionGroupAndPermissionListListResult {
      data = typeof data === 'object' ? data : {};
      let result = new GetPermissionGroupAndPermissionListListResult();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      if (Array.isArray(this.items)) {
          data["items"] = [];
          for (let item of this.items)
              data["items"].push(item.toJSON());
      }
      return data;
  }
}

export interface IGetPermissionGroupAndPermissionListListResult {
  items: GetPermissionGroupAndPermissionList[] | undefined;
}

export class PermissionAndUserInfo implements IPermissionAndUserInfo {
  permissionId!: number;
  permissionName!: string | undefined;
  isChecked!: boolean;

  constructor(data?: IPermissionAndUserInfo) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          this.permissionId = _data["permissionId"];
          this.permissionName = _data["permissionName"];
          this.isChecked = _data["isChecked"];
      }
  }

  static fromJS(data: any): PermissionAndUserInfo {
      data = typeof data === 'object' ? data : {};
      let result = new PermissionAndUserInfo();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["permissionId"] = this.permissionId;
      data["permissionName"] = this.permissionName;
      data["isChecked"] = this.isChecked;
      return data;
  }
}

export interface IPermissionAndUserInfo {
  permissionId: number;
  permissionName: string | undefined;
  isChecked: boolean;
}
export class GetPermissionGroupAndPermissionList implements IGetPermissionGroupAndPermissionList {
  permissionGroupId!: number;
  permissionGroupName!: string | undefined;
  permissionList!: PermissionAndUserInfo[] | undefined;

  constructor(data?: IGetPermissionGroupAndPermissionList) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          this.permissionGroupId = _data["permissionGroupId"];
          this.permissionGroupName = _data["permissionGroupName"];
          if (Array.isArray(_data["permissionList"])) {
              this.permissionList = [] as any;
              for (let item of _data["permissionList"])
                  this.permissionList!.push(PermissionAndUserInfo.fromJS(item));
          }
      }
  }

  static fromJS(data: any): GetPermissionGroupAndPermissionList {
      data = typeof data === 'object' ? data : {};
      let result = new GetPermissionGroupAndPermissionList();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["permissionGroupId"] = this.permissionGroupId;
      data["permissionGroupName"] = this.permissionGroupName;
      if (Array.isArray(this.permissionList)) {
          data["permissionList"] = [];
          for (let item of this.permissionList)
              data["permissionList"].push(item.toJSON());
      }
      return data;
  }
}
export class CreateOrUpdateUserPermissionInput implements ICreateOrUpdateUserPermissionInput {
    userId!: number;
    permissionList!: CreateUserPermissionInput[] | undefined;

    constructor(data?: ICreateOrUpdateUserPermissionInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.userId = _data["userId"];
            if (Array.isArray(_data["permissionList"])) {
                this.permissionList = [] as any;
                for (let item of _data["permissionList"])
                    this.permissionList!.push(CreateUserPermissionInput.fromJS(item));
            }
        }
    }

    static fromJS(data: any): CreateOrUpdateUserPermissionInput {
        data = typeof data === 'object' ? data : {};
        let result = new CreateOrUpdateUserPermissionInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["userId"] = this.userId;
        if (Array.isArray(this.permissionList)) {
            data["permissionList"] = [];
            for (let item of this.permissionList)
                data["permissionList"].push(item.toJSON());
        }
        return data;
    }
}

export interface ICreateOrUpdateUserPermissionInput {
    userId: number;
    permissionList: CreateUserPermissionInput[] | undefined;
}
export class CreateUserPermissionInput implements ICreateUserPermissionInput {
    permissionId!: number;

    constructor(data?: ICreateUserPermissionInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.permissionId = _data["permissionId"];
        }
    }

    static fromJS(data: any): CreateUserPermissionInput {
        data = typeof data === 'object' ? data : {};
        let result = new CreateUserPermissionInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["permissionId"] = this.permissionId;
        return data;
    }
}

export interface ICreateUserPermissionInput {
    permissionId: number;
}
