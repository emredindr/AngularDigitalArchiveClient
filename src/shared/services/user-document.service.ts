import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { blobToText, throwException } from './common/extension.service';


import { DateTime, Duration } from "luxon";
import { AppConsts } from './constracts/AppConsts';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');


@Injectable()
export class UserDocumentService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, private _localStorageService: LocalStorageService, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        // this.baseUrl ="https://localhost:7048";
        this.baseUrl = environment.baseUrl;

    }

    /**
     * @param searchText (optional) 
     * @param categoryId (optional) 
     * @param userId (optional) 
     * @param skipCount (optional) 
     * @param maxResultCount (optional) 
     * @return Success
     */
    getAllUserDocumentByPage(searchText: string | undefined, categoryId: number | undefined, userId: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined): Observable<GetAllUserDocumentInfoPagedResult> {
        // let url_ = this.baseUrl + "/api/UserDocument/GetAllUserDocumentByPage?";
        let url_ = `${this.baseUrl}/api/UserDocument/GetAllUserDocumentByPage?`;
        if (searchText === null)
            throw new Error("The parameter 'searchText' cannot be null.");
        else if (searchText !== undefined)
            url_ += "SearchText=" + encodeURIComponent("" + searchText) + "&";
        if (categoryId === null)
            throw new Error("The parameter 'categoryId' cannot be null.");
        else if (categoryId !== undefined)
            url_ += "CategoryId=" + encodeURIComponent("" + categoryId) + "&";
        if (userId === null)
            throw new Error("The parameter 'userId' cannot be null.");
        else if (userId !== undefined)
            url_ += "UserId=" + encodeURIComponent("" + userId) + "&";
        if (skipCount === null)
            throw new Error("The parameter 'skipCount' cannot be null.");
        else if (skipCount !== undefined)
            url_ += "SkipCount=" + encodeURIComponent("" + skipCount) + "&";
        if (maxResultCount === null)
            throw new Error("The parameter 'maxResultCount' cannot be null.");
        else if (maxResultCount !== undefined)
            url_ += "MaxResultCount=" + encodeURIComponent("" + maxResultCount) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain",
                "Authorization": `Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetAllUserDocumentByPage(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllUserDocumentByPage(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllUserDocumentInfoPagedResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllUserDocumentInfoPagedResult>;
        }));
    }

    /**
     * @param userDocumentId (optional) 
     * @return Success
     */
    getUserDocumentById(userDocumentId: number | undefined): Observable<GetAllUserDocumentInfo> {
        let url_ = this.baseUrl + "/api/UserDocument/GetUserDocumentById?";
        if (userDocumentId === null)
            throw new Error("The parameter 'userDocumentId' cannot be null.");
        else if (userDocumentId !== undefined)
            url_ += "userDocumentId=" + encodeURIComponent("" + userDocumentId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain",
                "Authorization": `Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetUserDocumentById(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetUserDocumentById(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllUserDocumentInfo>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllUserDocumentInfo>;
        }));
    }

    protected processGetUserDocumentById(response: HttpResponseBase): Observable<GetAllUserDocumentInfo> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = GetAllUserDocumentInfo.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllUserDocumentInfo>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createUserDocument(body: CreateUserDocumentInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/UserDocument/CreateUserDocument";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processCreateUserDocument(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateUserDocument(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processCreateUserDocument(response: HttpResponseBase): Observable<void> {
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

    /**
     * @param body (optional) 
     * @return Success
     */
    updateUserDocument(body: UpdateUserDocumentInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/UserDocument/UpdateUserDocument";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processUpdateUserDocument(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateUserDocument(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processUpdateUserDocument(response: HttpResponseBase): Observable<void> {
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

    /**
     * @param userDocumentId (optional) 
     * @return Success
     */
    deleteUserDocument(userDocumentId: number | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/UserDocument/DeleteUserDocument?";
        if (userDocumentId === null)
            throw new Error("The parameter 'userDocumentId' cannot be null.");
        else if (userDocumentId !== undefined)
            url_ += "userDocumentId=" + encodeURIComponent("" + userDocumentId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Authorization": `Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDeleteUserDocument(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteUserDocument(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeleteUserDocument(response: HttpResponseBase): Observable<void> {
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
    protected processGetAllUserDocumentByPage(response: HttpResponseBase): Observable<GetAllUserDocumentInfoPagedResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = GetAllUserDocumentInfoPagedResult.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllUserDocumentInfoPagedResult>(null as any);
    }
}

export class GetAllUserDocumentInfoPagedResult implements IGetAllUserDocumentInfoPagedResult {
    items!: GetAllUserDocumentInfo[] | undefined;
    totalCount!: number;

    constructor(data?: IGetAllUserDocumentInfoPagedResult) {
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
                    this.items!.push(GetAllUserDocumentInfo.fromJS(item));
            }
            this.totalCount = _data["totalCount"];
        }
    }

    static fromJS(data: any): GetAllUserDocumentInfoPagedResult {
        data = typeof data === 'object' ? data : {};
        let result = new GetAllUserDocumentInfoPagedResult();
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

export interface IGetAllUserDocumentInfoPagedResult {
    items: GetAllUserDocumentInfo[] | undefined;
    totalCount: number;
}

export interface IDocumentInfo {
    id: number;
    name: string | undefined;
    contentType: string | undefined;
    downloadUrl: string | undefined;
}

export class DocumentUserInfo implements IDocumentUserInfo {
    userId!: number;
    name!: string | undefined;
    surname!: string | undefined;
    readonly fullName!: string | undefined;

    constructor(data?: IDocumentUserInfo) {
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
            this.name = _data["name"];
            this.surname = _data["surname"];
            (<any>this).fullName = _data["fullName"];
        }
    }

    static fromJS(data: any): DocumentUserInfo {
        data = typeof data === 'object' ? data : {};
        let result = new DocumentUserInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["userId"] = this.userId;
        data["name"] = this.name;
        data["surname"] = this.surname;
        data["fullName"] = this.fullName;
        return data;
    }
}

export interface IDocumentUserInfo {
    userId: number;
    name: string | undefined;
    surname: string | undefined;
    fullName: string | undefined;
}

export class DocumentCategoryInfo implements IDocumentCategoryInfo {
    categoryId!: number;
    name!: string | undefined;

    constructor(data?: IDocumentCategoryInfo) {
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
            this.name = _data["name"];
        }
    }

    static fromJS(data: any): DocumentCategoryInfo {
        data = typeof data === 'object' ? data : {};
        let result = new DocumentCategoryInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["categoryId"] = this.categoryId;
        data["name"] = this.name;
        return data;
    }
}

export interface IDocumentCategoryInfo {
    categoryId: number;
    name: string | undefined;
}

export class DocumentCategoryTypeInfo implements IDocumentCategoryTypeInfo {
    categoryTpyeId!: number;
    name!: string | undefined;

    constructor(data?: IDocumentCategoryTypeInfo) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.categoryTpyeId = _data["categoryTpyeId"];
            this.name = _data["name"];
        }
    }

    static fromJS(data: any): DocumentCategoryTypeInfo {
        data = typeof data === 'object' ? data : {};
        let result = new DocumentCategoryTypeInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["categoryTpyeId"] = this.categoryTpyeId;
        data["name"] = this.name;
        return data;
    }
}

export interface IDocumentCategoryTypeInfo {
    categoryTpyeId: number;
    name: string | undefined;
}

export class DocumentInfo implements IDocumentInfo {
    id!: number;
    name!: string | undefined;
    contentType!: string | undefined;
    downloadUrl!: string | undefined;

    constructor(data?: IDocumentInfo) {
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
            this.contentType = _data["contentType"];
            this.downloadUrl = _data["downloadUrl"];
        }
    }

    static fromJS(data: any): DocumentInfo {
        data = typeof data === 'object' ? data : {};
        let result = new DocumentInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["contentType"] = this.contentType;
        data["downloadUrl"] = this.downloadUrl;
        return data;
    }
}


export class CreateUserDocumentInput implements ICreateUserDocumentInput {
    documentId!: number;
    documentTitle!: string | undefined;
    categoryId!: number;
    userId!: number;

    constructor(data?: ICreateUserDocumentInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.documentId = _data["documentId"];
            this.documentTitle = _data["documentTitle"];
            this.categoryId = _data["categoryId"];
            this.userId = _data["userId"];
        }
    }

    static fromJS(data: any): CreateUserDocumentInput {
        data = typeof data === 'object' ? data : {};
        let result = new CreateUserDocumentInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["documentId"] = this.documentId;
        data["documentTitle"] = this.documentTitle;
        data["categoryId"] = this.categoryId;
        data["userId"] = this.userId;
        return data;
    }
}

export interface ICreateUserDocumentInput {
    documentId: number;
    documentTitle: string | undefined;
    categoryId: number;
    userId: number;
}


export class GetAllUserDocumentInfo implements IGetAllUserDocumentInfo {
    userDocumentId!: number;
    documentUser!: DocumentUserInfo;
    documentCategory!: DocumentCategoryInfo;
    documentCategoryType!: DocumentCategoryTypeInfo;
    documentInfo!: DocumentInfo;
    documentTitle!: string | undefined;
    creationTime!: DateTime;

    constructor(data?: IGetAllUserDocumentInfo) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.documentUser = _data["documentUser"] ? DocumentUserInfo.fromJS(_data["documentUser"]) : <any>undefined;
            this.documentCategory = _data["documentCategory"] ? DocumentCategoryInfo.fromJS(_data["documentCategory"]) : <any>undefined;
            this.documentCategoryType = _data["documentCategoryType"] ? DocumentCategoryTypeInfo.fromJS(_data["documentCategoryType"]) : <any>undefined;
            this.documentInfo = _data["documentInfo"] ? DocumentInfo.fromJS(_data["documentInfo"]) : <any>undefined;
            this.userDocumentId = _data["userDocumentId"];
            this.documentTitle = _data["documentTitle"];
            this.creationTime = _data["creationTime"] ? DateTime.fromISO(_data["creationTime"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): GetAllUserDocumentInfo {
        data = typeof data === 'object' ? data : {};
        let result = new GetAllUserDocumentInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["documentUser"] = this.documentUser ? this.documentUser.toJSON() : <any>undefined;
        data["documentCategory"] = this.documentCategory ? this.documentCategory.toJSON() : <any>undefined;
        data["documentCategoryType"] = this.documentCategoryType ? this.documentCategoryType.toJSON() : <any>undefined;
        data["documentInfo"] = this.documentInfo ? this.documentInfo.toJSON() : <any>undefined;
        data["userDocumentId"] = this.userDocumentId;
        data["documentTitle"] = this.documentTitle;
        data["creationTime"] = this.creationTime ? this.creationTime.toString() : <any>undefined;
        return data;
    }
}

export interface IGetAllUserDocumentInfo {
    documentUser: DocumentUserInfo;
    documentCategory: DocumentCategoryInfo;
    documentCategoryType: DocumentCategoryTypeInfo;
    documentInfo: DocumentInfo;
    userDocumentId: number;
    documentTitle: string | undefined;
    creationTime: DateTime;
}


export class UpdateUserDocumentInput implements IUpdateUserDocumentInput {
    userDocumentId!: number;
    documentId!: number;
    documentTitle!: string | undefined;
    categoryId!: number;
    userId!: number;

    constructor(data?: IUpdateUserDocumentInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.userDocumentId = _data["userDocumentId"];
            this.documentId = _data["documentId"];
            this.documentTitle = _data["documentTitle"];
            this.categoryId = _data["categoryId"];
            this.userId = _data["userId"];
        }
    }

    static fromJS(data: any): UpdateUserDocumentInput {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateUserDocumentInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["userDocumentId"] = this.userDocumentId;
        data["documentId"] = this.documentId;
        data["documentTitle"] = this.documentTitle;
        data["categoryId"] = this.categoryId;
        data["userId"] = this.userId;
        return data;
    }
}

export interface IUpdateUserDocumentInput {
    userDocumentId: number;
    documentId: number;
    documentTitle: string | undefined;
    categoryId: number;
    userId: number;
}