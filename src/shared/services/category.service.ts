import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { blobToText, throwException } from './common/extension.service';
import { LocalStorageService } from './local-storage.service';
import { AppConsts } from './constracts/AppConsts';
import { environment } from 'src/environments/environment';


export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');


@Injectable()
export class CategoryService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient,private _localStorageService:LocalStorageService, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        // this.baseUrl = "https://localhost:7048";
        this.baseUrl =environment.baseUrl;

    }

    /**
     * @param categoryId (optional) 
     * @return Success
     */
    getCategoryById(categoryId: number | undefined): Observable<GetAllCategoryInfo> {
        // let url_ = this.baseUrl + "/api/Category/GetCategoryById?";
        let url_ = `${this.baseUrl}/api/Category/GetCategoryById?`;
        if (categoryId === null)
            throw new Error("The parameter 'categoryId' cannot be null.");
        else if (categoryId !== undefined)
            url_ += "categoryId=" + encodeURIComponent("" + categoryId) + "&";
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
            return this.processGetCategoryById(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetCategoryById(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllCategoryInfo>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllCategoryInfo>;
        }));
    }

    protected processGetCategoryById(response: HttpResponseBase): Observable<GetAllCategoryInfo> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllCategoryInfo.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllCategoryInfo>(null as any);
    }

      /**
     * @param searchText (optional) 
     * @param categoryTypeId (optional) 
     * @param parentCategoryId (optional) 
     * @return Success
     */
       getCategoryList(searchText: string | undefined, categoryTypeId: number | undefined, parentCategoryId: number | undefined): Observable<GetAllCategoryInfoListResult> {
        let url_ = this.baseUrl + "/api/Category/GetCategoryList?";
        if (searchText === null)
            throw new Error("The parameter 'searchText' cannot be null.");
        else if (searchText !== undefined)
            url_ += "SearchText=" + encodeURIComponent("" + searchText) + "&";
        if (categoryTypeId === null)
            throw new Error("The parameter 'categoryTypeId' cannot be null.");
        else if (categoryTypeId !== undefined)
            url_ += "CategoryTypeId=" + encodeURIComponent("" + categoryTypeId) + "&";
        if (parentCategoryId === null)
            throw new Error("The parameter 'parentCategoryId' cannot be null.");
        else if (parentCategoryId !== undefined)
            url_ += "ParentCategoryId=" + encodeURIComponent("" + parentCategoryId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain",
                // "Authorization":`Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetCategoryList(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetCategoryList(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllCategoryInfoListResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllCategoryInfoListResult>;
        }));
    }

    protected processGetCategoryList(response: HttpResponseBase): Observable<GetAllCategoryInfoListResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllCategoryInfoListResult.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllCategoryInfoListResult>(null as any);
    }
    /**
     * @param searchText (optional) 
     * @param skipCount (optional) 
     * @param maxResultCount (optional) 
     * @return Success
     */
    getAllCategoryByPage(searchText: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined): Observable<GetAllCategoryInfoPagedResult> {
        let url_ = this.baseUrl + "/api/Category/GetAllCategoryByPage?";
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
                // "Authorization":`Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllCategoryByPage(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllCategoryByPage(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllCategoryInfoPagedResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllCategoryInfoPagedResult>;
        }));
    }

    protected processGetAllCategoryByPage(response: HttpResponseBase): Observable<GetAllCategoryInfoPagedResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllCategoryInfoPagedResult.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllCategoryInfoPagedResult>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createCategory(body: CreateCategoryInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/Category/CreateCategory";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                // "Authorization":`Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processCreateCategory(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateCategory(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processCreateCategory(response: HttpResponseBase): Observable<void> {
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
    updateCategory(body: UpdateCategoryInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/Category/UpdateCategory";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                // "Authorization":`Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processUpdateCategory(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateCategory(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processUpdateCategory(response: HttpResponseBase): Observable<void> {
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
    deleteCategory(id: number | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/Category/DeleteCategory?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            //   "Authorization":`Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeleteCategory(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteCategory(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeleteCategory(response: HttpResponseBase): Observable<void> {
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

export class CreateCategoryInput implements ICreateCategoryInput {
    name!: string | undefined;
    categoryTypeId!: number;
    parentCategoryId!: number;
    categoryTypeName!: string | undefined;

    constructor(data?: ICreateCategoryInput) {
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
            this.categoryTypeId = _data["categoryTypeId"];
            this.parentCategoryId = _data["parentCategoryId"];
            this.categoryTypeName = _data["categoryTypeName"];

        }
    }

    static fromJS(data: any): CreateCategoryInput {
        data = typeof data === 'object' ? data : {};
        let result = new CreateCategoryInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["categoryTypeId"] = this.categoryTypeId;
        data["parentCategoryId"] = this.parentCategoryId;
        data["categoryTypeName"] = this.categoryTypeName;
        return data;
    }
}

export interface ICreateCategoryInput {
    name: string | undefined;
    categoryTypeId: number;
    parentCategoryId: number;
}

export class GetAllCategoryInfo implements IGetAllCategoryInfo {
    id!: number;
    name!: string ;
    parentCategoryId!: number;
    categoryTypeId!: number;
    categoryTypeName!: string | undefined;

    constructor(data?: IGetAllCategoryInfo) {
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
            this.parentCategoryId = _data["parentCategoryId"];
            this.categoryTypeId = _data["categoryTypeId"];
            this.categoryTypeName = _data["categoryTypeName"];
        }
    }

    static fromJS(data: any): GetAllCategoryInfo {
        data = typeof data === 'object' ? data : {};
        let result = new GetAllCategoryInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["parentCategoryId"] = this.parentCategoryId;
        data["categoryTypeId"] = this.categoryTypeId;
        data["categoryTypeName"] = this.categoryTypeName;

        return data;
    }
}

export interface IGetAllCategoryInfo {
    id: number;
    name: string;
    parentCategoryId: number;
    categoryTypeId: number;
    categoryTypeName: string | undefined;
}

export class GetAllCategoryInfoPagedResult implements IGetAllCategoryInfoPagedResult {
    items!: GetAllCategoryInfo[] | undefined;
    totalCount!: number;

    constructor(data?: IGetAllCategoryInfoPagedResult) {
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
                    this.items!.push(GetAllCategoryInfo.fromJS(item));
            }
            this.totalCount = _data["totalCount"];
        }
    }

    static fromJS(data: any): GetAllCategoryInfoPagedResult {
        data = typeof data === 'object' ? data : {};
        let result = new GetAllCategoryInfoPagedResult();
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

export interface IGetAllCategoryInfoPagedResult {
    items: GetAllCategoryInfo[] | undefined;
    totalCount: number;
}

export class UpdateCategoryInput implements IUpdateCategoryInput {
    id!: number;
    name!: string | undefined;
    categoryTypeId!: number;
    parentCategoryId!: number;

    constructor(data?: IUpdateCategoryInput) {
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
            this.categoryTypeId = _data["categoryTypeId"];
            this.parentCategoryId = _data["parentCategoryId"];
        }
    }

    static fromJS(data: any): UpdateCategoryInput {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateCategoryInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["categoryTypeId"] = this.categoryTypeId;
        data["parentCategoryId"] = this.parentCategoryId;
        return data;
    }
}

export interface IUpdateCategoryInput {
    id: number;
    name: string | undefined;
    categoryTypeId: number;
    parentCategoryId: number;
}

export class GetAllCategoryInfoListResult implements IGetAllCategoryInfoListResult {
    items!: GetAllCategoryInfo[] | undefined;

    constructor(data?: IGetAllCategoryInfoListResult) {
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
                    this.items!.push(GetAllCategoryInfo.fromJS(item));
            }
        }
    }

    static fromJS(data: any): GetAllCategoryInfoListResult {
        data = typeof data === 'object' ? data : {};
        let result = new GetAllCategoryInfoListResult();
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

export interface IGetAllCategoryInfoListResult {
    items: GetAllCategoryInfo[] | undefined;
}

