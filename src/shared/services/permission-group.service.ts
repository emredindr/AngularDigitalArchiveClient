import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { blobToText, throwException } from './common/extension.service';
import { AppConsts } from './constracts/AppConsts';
import { LocalStorageService } from './local-storage.service';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');


@Injectable()
export class PermissionGroupService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient,private _localStorageService:LocalStorageService, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = "https://localhost:7048";
    }

    /**
     * @param permissionGroupId (optional) 
     * @return Success
     */
    getPermissionGroupById(permissionGroupId: number | undefined): Observable<GetAllPermissionGroupInfo> {
        let url_ = this.baseUrl + "/api/PermissionGroup/GetPermissionGroupById?";
        if (permissionGroupId === null)
            throw new Error("The parameter 'permissionGroupId' cannot be null.");
        else if (permissionGroupId !== undefined)
            url_ += "permissionGroupId=" + encodeURIComponent("" + permissionGroupId) + "&";
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
            return this.processGetPermissionGroupById(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetPermissionGroupById(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllPermissionGroupInfo>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllPermissionGroupInfo>;
        }));
    }

    protected processGetPermissionGroupById(response: HttpResponseBase): Observable<GetAllPermissionGroupInfo> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllPermissionGroupInfo.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllPermissionGroupInfo>(null as any);
    }

    /**
     * @param searchText (optional) 
     * @param skipCount (optional) 
     * @param maxResultCount (optional) 
     * @return Success
     */
    getAllPermissionGroupByPage(searchText: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined): Observable<GetAllPermissionGroupInfoPagedResult> {
        let url_ = this.baseUrl + "/api/PermissionGroup/GetAllPermissionGroupByPage?";
        if (searchText === null)
            throw new Error("The parameter 'searchText' cannot be null.");
        else if (searchText !== undefined)
            url_ += "SearchText=" + encodeURIComponent("" + searchText) + "&";
        if (skipCount === null)
            throw new Error("The parameter 'skipCount' cannot be null.");
        else if (skipCount !== undefined)
            url_ += "SkipCount=" + encodeURIComponent("" + skipCount) + "&";
        if (maxResultCount === null)
            throw new Error("The parameter 'maxResultCount' cannot be null.");
        else if (maxResultCount !== undefined)
            url_ += "MaxResultCount=" + encodeURIComponent("" + maxResultCount) + "&";
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
            return this.processGetAllPermissionGroupByPage(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllPermissionGroupByPage(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllPermissionGroupInfoPagedResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllPermissionGroupInfoPagedResult>;
        }));
    }

    protected processGetAllPermissionGroupByPage(response: HttpResponseBase): Observable<GetAllPermissionGroupInfoPagedResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllPermissionGroupInfoPagedResult.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllPermissionGroupInfoPagedResult>(null as any);
    }

    /**
     * @return Success
     */
    getPermissionGroupList(): Observable<GetAllPermissionGroupInfoListResult> {
        let url_ = this.baseUrl + "/api/PermissionGroup/GetPermissionGroupList";
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
            return this.processGetPermissionGroupList(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetPermissionGroupList(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllPermissionGroupInfoListResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllPermissionGroupInfoListResult>;
        }));
    }

    protected processGetPermissionGroupList(response: HttpResponseBase): Observable<GetAllPermissionGroupInfoListResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllPermissionGroupInfoListResult.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllPermissionGroupInfoListResult>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createPermissionGroup(body: CreatePermissionGroupInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/PermissionGroup/CreatePermissionGroup";
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
            return this.processCreatePermissionGroup(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreatePermissionGroup(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processCreatePermissionGroup(response: HttpResponseBase): Observable<void> {
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

    /**
     * @param body (optional) 
     * @return Success
     */
    updatePermissionGroup(body: UpdatePermissionGroupInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/PermissionGroup/UpdatePermissionGroup";
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
            return this.processUpdatePermissionGroup(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdatePermissionGroup(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processUpdatePermissionGroup(response: HttpResponseBase): Observable<void> {
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

    /**
     * @param permissionGroupId (optional) 
     * @return Success
     */
    deletePermissionGroup(permissionGroupId: number | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/PermissionGroup/DeletePermissionGroup?";
        if (permissionGroupId === null)
            throw new Error("The parameter 'permissionGroupId' cannot be null.");
        else if (permissionGroupId !== undefined)
            url_ += "permissionGroupId=" + encodeURIComponent("" + permissionGroupId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Authorization":`Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeletePermissionGroup(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeletePermissionGroup(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeletePermissionGroup(response: HttpResponseBase): Observable<void> {
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

export class GetAllPermissionGroupInfo implements IGetAllPermissionGroupInfo {
  id!: number;
  name!: string;
  description!: string | undefined;

  constructor(data?: IGetAllPermissionGroupInfo) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          this.id = _data["id"];
          this.name = _data["name"];
          this.description = _data["description"];
      }
  }

  static fromJS(data: any): GetAllPermissionGroupInfo {
      data = typeof data === 'object' ? data : {};
      let result = new GetAllPermissionGroupInfo();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["id"] = this.id;
      data["name"] = this.name;
      data["description"] = this.description;
      return data;
  }
}

export interface IGetAllPermissionGroupInfo {
  id: number;
  name: string;
  description: string | undefined;
}

export class GetAllPermissionGroupInfoListResult implements IGetAllPermissionGroupInfoListResult {
  items!: GetAllPermissionGroupInfo[] | undefined;

  constructor(data?: IGetAllPermissionGroupInfoListResult) {
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
                  this.items!.push(GetAllPermissionGroupInfo.fromJS(item));
          }
      }
  }

  static fromJS(data: any): GetAllPermissionGroupInfoListResult {
      data = typeof data === 'object' ? data : {};
      let result = new GetAllPermissionGroupInfoListResult();
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

export interface IGetAllPermissionGroupInfoListResult {
  items: GetAllPermissionGroupInfo[] | undefined;
}

export class GetAllPermissionGroupInfoPagedResult implements IGetAllPermissionGroupInfoPagedResult {
  items!: GetAllPermissionGroupInfo[] | undefined;
  totalCount!: number;

  constructor(data?: IGetAllPermissionGroupInfoPagedResult) {
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
                  this.items!.push(GetAllPermissionGroupInfo.fromJS(item));
          }
          this.totalCount = _data["totalCount"];
      }
  }

  static fromJS(data: any): GetAllPermissionGroupInfoPagedResult {
      data = typeof data === 'object' ? data : {};
      let result = new GetAllPermissionGroupInfoPagedResult();
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
      data["totalCount"] = this.totalCount;
      return data;
  }
}

export interface IGetAllPermissionGroupInfoPagedResult {
  items: GetAllPermissionGroupInfo[] | undefined;
  totalCount: number;
}


export class CreatePermissionGroupInput implements ICreatePermissionGroupInput {
  name!: string | undefined;
  description!: string | undefined;

  constructor(data?: ICreatePermissionGroupInput) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          this.name = _data["name"];
          this.description = _data["description"];
      }
  }

  static fromJS(data: any): CreatePermissionGroupInput {
      data = typeof data === 'object' ? data : {};
      let result = new CreatePermissionGroupInput();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["name"] = this.name;
      data["description"] = this.description;
      return data;
  }
}

export interface ICreatePermissionGroupInput {
  name: string | undefined;
  description: string | undefined;
}


export class UpdatePermissionGroupInput implements IUpdatePermissionGroupInput {
  id!: number;
  name!: string | undefined;
  description!: string | undefined;

  constructor(data?: IUpdatePermissionGroupInput) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          this.id = _data["id"];
          this.name = _data["name"];
          this.description = _data["description"];
      }
  }

  static fromJS(data: any): UpdatePermissionGroupInput {
      data = typeof data === 'object' ? data : {};
      let result = new UpdatePermissionGroupInput();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["id"] = this.id;
      data["name"] = this.name;
      data["description"] = this.description;
      return data;
  }
}

export interface IUpdatePermissionGroupInput {
  id: number;
  name: string | undefined;
  description: string | undefined;
}