import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { blobToText, throwException } from './common/extension.service';
import { AppConsts } from './constracts/AppConsts';
import { LocalStorageService } from './local-storage.service';


export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable()
export class CategoryTypeService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient,private _localStorageService:LocalStorageService ,@Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl ="https://localhost:7048";
    }

    /**
     * @param searchText (optional) 
     * @param skipCount (optional) 
     * @param maxResultCount (optional) 
     * @return Success
     */
    getAllCategoryTypeByPage(searchText: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined): Observable<GetAllCategoryTypeInfoPagedResult> {
        let url_ = this.baseUrl + "/api/CategoryType/GetAllCategoryTypeByPage?";
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
            return this.processGetAllCategoryTypeByPage(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllCategoryTypeByPage(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllCategoryTypeInfoPagedResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllCategoryTypeInfoPagedResult>;
        }));
    }

    protected processGetAllCategoryTypeByPage(response: HttpResponseBase): Observable<GetAllCategoryTypeInfoPagedResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllCategoryTypeInfoPagedResult.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllCategoryTypeInfoPagedResult>(null as any);
    }

    /**
     * @return Success
     */
    getCategoryTypeList(): Observable<GetAllCategoryTypeInfoListResult> {
        let url_ = this.baseUrl + "/api/CategoryType/GetCategoryTypeList";
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
            return this.processGetCategoryTypeList(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetCategoryTypeList(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllCategoryTypeInfoListResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllCategoryTypeInfoListResult>;
        }));
    }

    protected processGetCategoryTypeList(response: HttpResponseBase): Observable<GetAllCategoryTypeInfoListResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllCategoryTypeInfoListResult.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllCategoryTypeInfoListResult>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createCategoryType(body: CreateCategoryTypeInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/CategoryType/CreateCategoryType";
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
            return this.processCreateCategoryType(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateCategoryType(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processCreateCategoryType(response: HttpResponseBase): Observable<void> {
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
    updateCategoryType(body: UpdateCategoryTypeInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/CategoryType/UpdateCategoryType";
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
            return this.processUpdateCategoryType(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateCategoryType(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processUpdateCategoryType(response: HttpResponseBase): Observable<void> {
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
    deleteCategoryType(id: number | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/CategoryType/DeleteCategoryType?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
              "Authorization":`Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeleteCategoryType(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteCategoryType(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeleteCategoryType(response: HttpResponseBase): Observable<void> {
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

export class GetAllCategoryTypeInfo implements IGetAllCategoryTypeInfo {
  id!: number;
  name!: string | undefined;

  constructor(data?: IGetAllCategoryTypeInfo) {
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
      }
  }

  static fromJS(data: any): GetAllCategoryTypeInfo {
      data = typeof data === 'object' ? data : {};
      let result = new GetAllCategoryTypeInfo();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["id"] = this.id;
      data["name"] = this.name;
      return data;
  }
}

export interface IGetAllCategoryTypeInfo {
  id: number;
  name: string | undefined;
}

export class GetAllCategoryTypeInfoListResult implements IGetAllCategoryTypeInfoListResult {
  items!: GetAllCategoryTypeInfo[] | undefined;

  constructor(data?: IGetAllCategoryTypeInfoListResult) {
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
                  this.items!.push(GetAllCategoryTypeInfo.fromJS(item));
          }
      }
  }

  static fromJS(data: any): GetAllCategoryTypeInfoListResult {
      data = typeof data === 'object' ? data : {};
      let result = new GetAllCategoryTypeInfoListResult();
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

export interface IGetAllCategoryTypeInfoListResult {
  items: GetAllCategoryTypeInfo[] | undefined;
}

export class GetAllCategoryTypeInfoPagedResult implements IGetAllCategoryTypeInfoPagedResult {
  items!: GetAllCategoryTypeInfo[] | undefined;
  totalCount!: number;

  constructor(data?: IGetAllCategoryTypeInfoPagedResult) {
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
                  this.items!.push(GetAllCategoryTypeInfo.fromJS(item));
          }
          this.totalCount = _data["totalCount"];
      }
  }

  static fromJS(data: any): GetAllCategoryTypeInfoPagedResult {
      data = typeof data === 'object' ? data : {};
      let result = new GetAllCategoryTypeInfoPagedResult();
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

export interface IGetAllCategoryTypeInfoPagedResult {
  items: GetAllCategoryTypeInfo[] | undefined;
  totalCount: number;
}

export class CreateCategoryTypeInput implements ICreateCategoryTypeInput {
  name!: string | undefined;

  constructor(data?: ICreateCategoryTypeInput) {
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
      }
  }

  static fromJS(data: any): CreateCategoryTypeInput {
      data = typeof data === 'object' ? data : {};
      let result = new CreateCategoryTypeInput();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["name"] = this.name;
      return data;
  }
}

export interface ICreateCategoryTypeInput {
  name: string | undefined;
}

export class UpdateCategoryTypeInput implements IUpdateCategoryTypeInput {
  id!: number;
  name!: string | undefined;

  constructor(data?: IUpdateCategoryTypeInput) {
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
      }
  }

  static fromJS(data: any): UpdateCategoryTypeInput {
      data = typeof data === 'object' ? data : {};
      let result = new UpdateCategoryTypeInput();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["id"] = this.id;
      data["name"] = this.name;
      return data;
  }
}

export interface IUpdateCategoryTypeInput {
  id: number;
  name: string | undefined;
}