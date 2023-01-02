import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { blobToText, throwException } from './common/extension.service';
import { AppConsts } from './constracts/AppConsts';

import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable()
export class UserCategoryService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient,private _localStorageService:LocalStorageService, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        // this.baseUrl = "https://localhost:7048"
        this.baseUrl =environment.baseUrl;

    }

/**
     * @param userId (optional) 
     * @return Success
     */
 getCategoryTypeAndCategoryList(userId: number | undefined): Observable<CategoryAndUserInfoListResult> {
    // let url_ = this.baseUrl + "/api/UserCategory/GetCategoryTypeAndCategoryList?";
    let url_ = `${this.baseUrl}/api/UserCategory/GetCategoryTypeAndCategoryList?`;
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
        return this.processGetCategoryTypeAndCategoryList(response_);
    })).pipe(_observableCatch((response_: any) => {
        if (response_ instanceof HttpResponseBase) {
            try {
                return this.processGetCategoryTypeAndCategoryList(response_ as any);
            } catch (e) {
                return _observableThrow(e) as any as Observable<CategoryAndUserInfoListResult>;
            }
        } else
            return _observableThrow(response_) as any as Observable<CategoryAndUserInfoListResult>;
    }));
}

protected processGetCategoryTypeAndCategoryList(response: HttpResponseBase): Observable<CategoryAndUserInfoListResult> {
    const status = response.status;
    const responseBlob =
        response instanceof HttpResponse ? response.body :
        (response as any).error instanceof Blob ? (response as any).error : undefined;

    let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
    if (status === 200) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        let result200: any = null;
        let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
        result200 = CategoryAndUserInfoListResult.fromJS(resultData200);
        return _observableOf(result200);
        }));
    } else if (status !== 200 && status !== 204) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }));
    }
    return _observableOf<CategoryAndUserInfoListResult>(null as any);
}

    /**
     * @param body (optional) 
     * @return Success
     */
    createOrUpdateUserCategory(body: CreateOrUpdateUserCategoryInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/UserCategory/CreateOrUpdateUserCategory";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization":`Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`

            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processCreateOrUpdateUserCategory(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateUserCategory(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processCreateOrUpdateUserCategory(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
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

export class GetCategoryTypeAndCategoryList implements IGetCategoryTypeAndCategoryList {
    categoryTypeId!: number;
    categoryTypeName!: string | undefined;
    categoryList!: CategoryAndUserInfo[] | undefined;

    constructor(data?: IGetCategoryTypeAndCategoryList) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.categoryTypeId = _data["categoryTypeId"];
            this.categoryTypeName = _data["categoryTypeName"];
            if (Array.isArray(_data["categoryList"])) {
                this.categoryList = [] as any;
                for (let item of _data["categoryList"])
                    this.categoryList!.push(CategoryAndUserInfo.fromJS(item));
            }
        }
    }

    static fromJS(data: any): GetCategoryTypeAndCategoryList {
        data = typeof data === 'object' ? data : {};
        let result = new GetCategoryTypeAndCategoryList();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["categoryTypeId"] = this.categoryTypeId;
        data["categoryTypeName"] = this.categoryTypeName;
        if (Array.isArray(this.categoryList)) {
            data["categoryList"] = [];
            for (let item of this.categoryList)
                data["categoryList"].push(item.toJSON());
        }
        return data;
    }
}

export interface IGetCategoryTypeAndCategoryList {
    categoryTypeId: number;
    categoryTypeName: string | undefined;
    categoryList: CategoryAndUserInfo[] | undefined;
}

export class GetCategoryTypeAndCategoryListListResult implements IGetCategoryTypeAndCategoryListListResult {
    items!: GetCategoryTypeAndCategoryList[] | undefined;

    constructor(data?: IGetCategoryTypeAndCategoryListListResult) {
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
                    this.items!.push(GetCategoryTypeAndCategoryList.fromJS(item));
            }
        }
    }

    static fromJS(data: any): GetCategoryTypeAndCategoryListListResult {
        data = typeof data === 'object' ? data : {};
        let result = new GetCategoryTypeAndCategoryListListResult();
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

export interface IGetCategoryTypeAndCategoryListListResult {
    items: GetCategoryTypeAndCategoryList[] | undefined;
}

export class CreateOrUpdateUserCategoryInput implements ICreateOrUpdateUserCategoryInput {
    userId!: number;
    categoryList!: CreateUserCategoryInput[] | undefined;

    constructor(data?: ICreateOrUpdateUserCategoryInput) {
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
            if (Array.isArray(_data["categoryList"])) {
                this.categoryList = [] as any;
                for (let item of _data["categoryList"])
                    this.categoryList!.push(CreateUserCategoryInput.fromJS(item));
            }
        }
    }

    static fromJS(data: any): CreateOrUpdateUserCategoryInput {
        data = typeof data === 'object' ? data : {};
        let result = new CreateOrUpdateUserCategoryInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["userId"] = this.userId;
        if (Array.isArray(this.categoryList)) {
            data["categoryList"] = [];
            for (let item of this.categoryList)
                data["categoryList"].push(item.toJSON());
        }
        return data;
    }
}

export interface ICreateOrUpdateUserCategoryInput {
    userId: number;
    categoryList: CreateUserCategoryInput[] | undefined;
}
export class CreateUserCategoryInput implements ICreateUserCategoryInput {
    categoryId!: number;

    constructor(data?: ICreateUserCategoryInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.categoryId = _data["categoryId"];
        }
    }

    static fromJS(data: any): CreateUserCategoryInput {
        data = typeof data === 'object' ? data : {};
        let result = new CreateUserCategoryInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["categoryId"] = this.categoryId;
        return data;
    }
}

export interface ICreateUserCategoryInput {
    categoryId: number;
}
export class CategoryAndUserInfo implements ICategoryAndUserInfo {
    categoryId!: number;
    parentCategoryId!: number;
    categoryName!: string | undefined;
    isChecked!: boolean;

    constructor(data?: ICategoryAndUserInfo) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.categoryId = _data["categoryId"];
            this.parentCategoryId = _data["parentCategoryId"];
            this.categoryName = _data["categoryName"];
            this.isChecked = _data["isChecked"];
        }
    }

    static fromJS(data: any): CategoryAndUserInfo {
        data = typeof data === 'object' ? data : {};
        let result = new CategoryAndUserInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["categoryId"] = this.categoryId;
        data["parentCategoryId"] = this.parentCategoryId;
        data["categoryName"] = this.categoryName;
        data["isChecked"] = this.isChecked;
        return data;
    }
}

export interface ICategoryAndUserInfo {
    categoryId: number;
    parentCategoryId: number;
    categoryName: string | undefined;
    isChecked: boolean;
}

export interface ICategoryAndUserInfo {
    categoryId: number;
    parentCategoryId: number;
    categoryName: string | undefined;
    isChecked: boolean;
}

export class CategoryAndUserInfoListResult implements ICategoryAndUserInfoListResult {
    items!: CategoryAndUserInfo[] | undefined;

    constructor(data?: ICategoryAndUserInfoListResult) {
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
                    this.items!.push(CategoryAndUserInfo.fromJS(item));
            }
        }
    }

    static fromJS(data: any): CategoryAndUserInfoListResult {
        data = typeof data === 'object' ? data : {};
        let result = new CategoryAndUserInfoListResult();
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

export interface ICategoryAndUserInfoListResult {
    items: CategoryAndUserInfo[] | undefined;
}