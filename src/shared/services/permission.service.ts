import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { blobToText, throwException } from './common/extension.service';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

import { LocalStorageService } from './local-storage.service';
import { AppConsts } from './constracts/AppConsts';

@Injectable()
export class PermissionService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient,private _localStorageService:LocalStorageService, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = "https://localhost:7048"
    }
   
   
    /**
     * @param permissionId (optional) 
     * @return Success
     */
    getPermissionById(permissionId: number | undefined): Observable<GetAllPermissionInfo> {
        let url_ = this.baseUrl + "/api/Permission/GetPermissionById?";
        if (permissionId === null)
            throw new Error("The parameter 'permissionId' cannot be null.");
        else if (permissionId !== undefined)
            url_ += "permissionId=" + encodeURIComponent("" + permissionId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain",
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetPermissionById(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetPermissionById(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllPermissionInfo>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllPermissionInfo>;
        }));
    }

    protected processGetPermissionById(response: HttpResponseBase): Observable<GetAllPermissionInfo> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllPermissionInfo.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllPermissionInfo>(null as any);
    }

    /**
     * @return Success
     */
     getPermissionList(): Observable<GetAllPermissionInfoListResult> {
        let url_ = this.baseUrl + "/api/Permission/GetPermissionList";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain",
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetPermissionList(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetPermissionList(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllPermissionInfoListResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllPermissionInfoListResult>;
        }));
    }

    protected processGetPermissionList(response: HttpResponseBase): Observable<GetAllPermissionInfoListResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllPermissionInfoListResult.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllPermissionInfoListResult>(null as any);
    }

    /**
     * @param searchText (optional) 
     * @param skipCount (optional) 
     * @param maxResultCount (optional) 
     * @return Success
     */
    getAllPermissionByPage(searchText: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined): Observable<GetAllPermissionInfoPagedResult> {
        let url_ = this.baseUrl + "/api/Permission/GetAllPermissionByPage?";
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
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllPermissionByPage(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllPermissionByPage(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllPermissionInfoPagedResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllPermissionInfoPagedResult>;
        }));
    }

    protected processGetAllPermissionByPage(response: HttpResponseBase): Observable<GetAllPermissionInfoPagedResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllPermissionInfoPagedResult.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllPermissionInfoPagedResult>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createPermission(body: CreatePermissionInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/Permission/CreatePermission";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processCreatePermission(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreatePermission(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processCreatePermission(response: HttpResponseBase): Observable<void> {
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
    updatePermission(body: UpdatePermissionInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/Permission/UpdatePermission";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processUpdatePermission(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdatePermission(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processUpdatePermission(response: HttpResponseBase): Observable<void> {
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
     * @param id (optional) 
     * @return Success
     */
    deletePermission(id: number | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/Permission/DeletePermission?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeletePermission(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeletePermission(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeletePermission(response: HttpResponseBase): Observable<void> {
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

export class CreatePermissionInput implements ICreatePermissionInput {
    name!: string | undefined;
    description!: string | undefined;
    permissionGroupId!: number;

    constructor(data?: ICreatePermissionInput) {
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
            this.permissionGroupId = _data["permissionGroupId"];
        }
    }

    static fromJS(data: any): CreatePermissionInput {
        data = typeof data === 'object' ? data : {};
        let result = new CreatePermissionInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["description"] = this.description;
        data["permissionGroupId"] = this.permissionGroupId;
        return data;
    }
}

export interface ICreatePermissionInput {
    name: string | undefined;
    description: string | undefined;
    permissionGroupId: number;
}

export class GetAllPermissionInfo implements IGetAllPermissionInfo {
    id!: number;
    name!: string | undefined;
    description!: string | undefined;
    permissionGroupId!: number;
    permissionGroupName!: string | undefined;

    constructor(data?: IGetAllPermissionInfo) {
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
            this.permissionGroupId = _data["permissionGroupId"];
            this.permissionGroupName = _data["permissionGroupName"];
        }
    }

    static fromJS(data: any): GetAllPermissionInfo {
        data = typeof data === 'object' ? data : {};
        let result = new GetAllPermissionInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["description"] = this.description;
        data["permissionGroupId"] = this.permissionGroupId;
        data["permissionGroupName"] = this.permissionGroupName;
        return data;
    }
}

export interface IGetAllPermissionInfo {
    id: number;
    name: string | undefined;
    description: string | undefined;
    permissionGroupId: number;
    permissionGroupName: string | undefined;
}

export class GetAllPermissionInfoPagedResult implements IGetAllPermissionInfoPagedResult {
  items!: GetAllPermissionInfo[] | undefined;
  totalCount!: number;

  constructor(data?: IGetAllPermissionInfoPagedResult) {
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
                  this.items!.push(GetAllPermissionInfo.fromJS(item));
          }
          this.totalCount = _data["totalCount"];
      }
  }

  static fromJS(data: any): GetAllPermissionInfoPagedResult {
      data = typeof data === 'object' ? data : {};
      let result = new GetAllPermissionInfoPagedResult();
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

export interface IGetAllPermissionInfoPagedResult {
  items: GetAllPermissionInfo[] | undefined;
  totalCount: number;
}

export class UpdatePermissionInput implements IUpdatePermissionInput {
    id!: number;
    name!: string | undefined;
    description!: string | undefined;
    permissionGroupId!: number;

    constructor(data?: IUpdatePermissionInput) {
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
            this.permissionGroupId = _data["permissionGroupId"];
        }
    }

    static fromJS(data: any): UpdatePermissionInput {
        data = typeof data === 'object' ? data : {};
        let result = new UpdatePermissionInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["description"] = this.description;
        data["permissionGroupId"] = this.permissionGroupId;
        return data;
    }
}

export interface IUpdatePermissionInput {
    id: number;
    name: string | undefined;
    description: string | undefined;
    permissionGroupId: number;
}


export class GetAllPermissionInfoListResult implements IGetAllPermissionInfoListResult {
    items!: GetAllPermissionInfo[] | undefined;

    constructor(data?: IGetAllPermissionInfoListResult) {
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
                    this.items!.push(GetAllPermissionInfo.fromJS(item));
            }
        }
    }

    static fromJS(data: any): GetAllPermissionInfoListResult {
        data = typeof data === 'object' ? data : {};
        let result = new GetAllPermissionInfoListResult();
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

export interface IGetAllPermissionInfoListResult {
    items: GetAllPermissionInfo[] | undefined;
}