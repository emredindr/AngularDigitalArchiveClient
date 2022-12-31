import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { blobToText, throwException } from './common/extension.service';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
//   let url_ = "https://localhost:7048/api/Auth/Authenticate";
@Injectable()
export class AuthService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

       /**
     * @param body (optional) 
     * @return Success
     */
        authenticate(body: UserLoginInput | undefined): Observable<UserLoginOutput> {
            let url_ = "https://localhost:7048/api/Auth/Authenticate";
            url_ = url_.replace(/[?&]$/, "");
    
            const content_ = JSON.stringify(body);
    
            let options_ : any = {
                body: content_,
                observe: "response",
                responseType: "blob",
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    "Accept": "text/plain"
                })
            };
    
            return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
                return this.processAuthenticate(response_);
            })).pipe(_observableCatch((response_: any) => {
                if (response_ instanceof HttpResponseBase) {
                    try {
                        return this.processAuthenticate(response_ as any);
                    } catch (e) {
                        return _observableThrow(e) as any as Observable<UserLoginOutput>;
                    }
                } else
                    return _observableThrow(response_) as any as Observable<UserLoginOutput>;
            }));
        }
    
        protected processAuthenticate(response: HttpResponseBase): Observable<UserLoginOutput> {
            const status = response.status;
            const responseBlob =
                response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;
    
            let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
            if (status === 200) {
                return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = UserLoginOutput.fromJS(resultData200);
                return _observableOf(result200);
                }));
            } else if (status !== 200 && status !== 204) {
                return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
                }));
            }
            return _observableOf<UserLoginOutput>(null as any);
        }
}


export class UserLoginInput implements IUserLoginInput {
    email!: string | undefined;
    password!: string | undefined;

    constructor(data?: IUserLoginInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.email = _data["email"];
            this.password = _data["password"];
        }
    }

    static fromJS(data: any): UserLoginInput {
        data = typeof data === 'object' ? data : {};
        let result = new UserLoginInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["email"] = this.email;
        data["password"] = this.password;
        return data;
    }
}

export interface IUserLoginInput {
    email: string | undefined;
    password: string | undefined;
}

export class UserLoginOutput implements IUserLoginOutput {
    id!: number;
    name!: string | undefined;
    surname!: string | undefined;
    userName!: string | undefined;
    email!: string | undefined;
    token!: string | undefined;

    constructor(data?: IUserLoginOutput) {
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
            this.token = _data["token"];
        }
    }

    static fromJS(data: any): UserLoginOutput {
        data = typeof data === 'object' ? data : {};
        let result = new UserLoginOutput();
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
        data["token"] = this.token;
        return data;
    }
}

export interface IUserLoginOutput {
    id: number;
    name: string | undefined;
    surname: string | undefined;
    userName: string | undefined;
    email: string | undefined;
    token: string | undefined;
}