import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { blobToText, throwException } from './common/extension.service';

import { DateTime } from "luxon";
import { LocalStorageService } from './local-storage.service';

import { AppConsts } from 'src/shared/services/constracts/AppConsts';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable()
export class UserService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient,private _localStorageService:LocalStorageService, @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        this.http = http;
        this.baseUrl ="https://localhost:7048" ;
    }

    /**
     * @param userId (optional) 
     * @return Success
     */
     getUserById(userId: number | undefined): Observable<GetAllUserInfo> {
        let url_ =this.baseUrl + "/api/User/GetUserById?";
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
            return this.processGetUserById(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetUserById(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllUserInfo>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllUserInfo>;
        }));
    }

    protected processGetUserById(response: HttpResponseBase): Observable<GetAllUserInfo> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            //gelen datayı kontrol et 
            result200 = GetAllUserInfo.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllUserInfo>(null as any);
    }
    /**
     * @return Success
     */
     getUserList(): Observable<GetAllUserInfoListResult> {
        let url_ = this.baseUrl + "/api/User/GetUserList";
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
            return this.processGetUserList(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetUserList(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllUserInfoListResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllUserInfoListResult>;
        }));
    }

    protected processGetUserList(response: HttpResponseBase): Observable<GetAllUserInfoListResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = GetAllUserInfoListResult.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllUserInfoListResult>(null as any);
    }

   

    /**
     * @param searchText (optional) 
     * @param isActive (optional) 
     * @param skipCount (optional) 
     * @param maxResultCount (optional) 
     * @return Success
     */
    getAllUsersByPage(searchText: string | undefined, isActive: UserStatusEnum | undefined, skipCount: number | undefined, maxResultCount: number | undefined): Observable<GetAllUserInfoPagedResult> {
        let url_ =this.baseUrl+ "/api/User/GetAllUsersByPage?"
        if (searchText === null)
            throw new Error("The parameter 'searchText' cannot be null.");
        else if (searchText !== undefined)
            url_ += "SearchText=" + encodeURIComponent("" + searchText) + "&";
        if (isActive === null)
            throw new Error("The parameter 'isActive' cannot be null.");
        else if (isActive !== undefined)
            url_ += "IsActive=" + encodeURIComponent("" + isActive) + "&";
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
                "Authorization":`Bearer ${this._localStorageService.getItem(AppConsts.lsToken)}`
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetAllUsersByPage(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllUsersByPage(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<GetAllUserInfoPagedResult>;
                }
            } else
                return _observableThrow(response_) as any as Observable<GetAllUserInfoPagedResult>;
        }));
    }

    protected processGetAllUsersByPage(response: HttpResponseBase): Observable<GetAllUserInfoPagedResult> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = GetAllUserInfoPagedResult.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<GetAllUserInfoPagedResult>(null as any);
    }
    /**
     * @param body (optional) 
     * @return Success
     */
    createUser(body: CreateUserInput | undefined): Observable<void> {
        let url_ = this.baseUrl+"/api/User/CreateUser";
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
            return this.processCreateUser(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateUser(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processCreateUser(response: HttpResponseBase): Observable<void> {
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
    updateUser(body: UpdateUserInput | undefined): Observable<void> {
        let url_ = this.baseUrl+"/api/User/UpdateUser";
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
            return this.processUpdateUser(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateUser(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processUpdateUser(response: HttpResponseBase): Observable<void> {
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
     * @param id (optional) 
     * @return Success
     */
    deleteUser(id: number | undefined): Observable<void> {
        let url_ = this.baseUrl+"/api/User/DeleteUser?";

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

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeleteUser(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteUser(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeleteUser(response: HttpResponseBase): Observable<void> {
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

export class GetAllUserInfo implements IGetAllUserInfo {
    id!: number;
    name!: string ;
    surname!: string ;
    userName!: string | undefined;
    email!: string | undefined;
    birthDate!: DateTime;


    constructor(data?: IGetAllUserInfo) {
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
            this.surname = _data["surname"];
            this.userName = _data["userName"];
            this.email = _data["email"];
            this.birthDate = _data["birthDate"] ? DateTime.fromISO(_data["birthDate"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): GetAllUserInfo {
        data = typeof data === 'object' ? data : {};
        let result = new GetAllUserInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["surname"] = this.surname;
        data["userName"] = this.userName;
        data["email"] = this.email;
        data["birthDate"] = this.birthDate ? this.birthDate.toString() : <any>undefined;

        return data;
    }
}

export interface IGetAllUserInfo {
    id: number;
    name: string ;
    surname: string ;
    userName: string | undefined;
    email: string | undefined;
    birthDate:DateTime;
}

export class GetAllUserInfoPagedResult implements IGetAllUserInfoPagedResult {
    items!: GetAllUserInfo[] | undefined;
    totalCount!: number;

    constructor(data?: IGetAllUserInfoPagedResult) {
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
                    this.items!.push(GetAllUserInfo.fromJS(item));
            }
            this.totalCount = _data["totalCount"];
        }
    }

    static fromJS(data: any): GetAllUserInfoPagedResult {
        data = typeof data === 'object' ? data : {};
        let result = new GetAllUserInfoPagedResult();
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

export interface IGetAllUserInfoPagedResult {
    items: GetAllUserInfo[] | undefined;
    totalCount: number;
}


export class UpdateUserInput implements IUpdateUserInput {
    id!: number;
    name!: string | undefined;
    surname!: string | undefined;
    userName!: string | undefined;
    email!: string | undefined;
    birthDate!: DateTime;
    isActive!: boolean;

    constructor(data?: IUpdateUserInput) {
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
            this.surname = _data["surname"];
            this.userName = _data["userName"];
            this.email = _data["email"];
            this.birthDate = _data["birthDate"] ? DateTime.fromISO(_data["birthDate"].toString()) : <any>undefined;
            this.isActive = _data["isActive"];
        }
    }

    static fromJS(data: any): UpdateUserInput {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateUserInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["surname"] = this.surname;
        data["userName"] = this.userName;
        data["email"] = this.email;
        data["birthDate"] = this.birthDate ? this.birthDate.toString() : <any>undefined;
        data["isActive"] = this.isActive;
        return data;
    }
}

export interface IUpdateUserInput {
    id: number;
    name: string | undefined;
    surname: string | undefined;
    userName: string | undefined;
    email: string | undefined;
    birthDate: DateTime;
    isActive: boolean;
}

export enum UserStatusEnum {
    _1 = 1,
    _2 = 2,
}


export class CreateUserInput implements ICreateUserInput {
    name!: string | undefined;
    surname!: string | undefined;
    userName!: string | undefined;
    email!: string | undefined;
    // birthDate!: DateTime| undefined;

    constructor(data?: ICreateUserInput) {
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
            this.surname = _data["surname"];
            this.userName = _data["userName"];
            this.email = _data["email"];
            // this.birthDate = _data["birthDate"] ? DateTime.fromISO(_data["birthDate"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): CreateUserInput {
        data = typeof data === 'object' ? data : {};
        let result = new CreateUserInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["surname"] = this.surname;
        data["userName"] = this.userName;
        data["email"] = this.email;
        // data["birthDate"] = this.birthDate ? this.birthDate.toString() : <any>undefined;
        return data;
    }
}

export interface ICreateUserInput {
    name: string | undefined;
    surname: string | undefined;
    userName: string | undefined;
    email: string | undefined;
    // birthDate: DateTime;
}
export class GetAllUserInfoListResult implements IGetAllUserInfoListResult {
    items!: GetAllUserInfo[] | undefined;

    constructor(data?: IGetAllUserInfoListResult) {
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
                    this.items!.push(GetAllUserInfo.fromJS(item));
            }
        }
    }

    static fromJS(data: any): GetAllUserInfoListResult {
        data = typeof data === 'object' ? data : {};
        let result = new GetAllUserInfoListResult();
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

export interface IGetAllUserInfoListResult {
    items: GetAllUserInfo[] | undefined;
}
