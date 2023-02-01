import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { Router } from "@angular/router";
import { LocalStorageService } from "../local-storage.service";
import { AppConsts } from "../constracts/AppConsts";
import { GlobalHttpConfigurationService } from "./global-http-configuration.service";

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  protected _configuration: GlobalHttpConfigurationService;

  constructor(public router: Router,
    private _localStorageService: LocalStorageService,
    configuration: GlobalHttpConfigurationService

  ) {
    this._configuration = configuration;
  }
  
  //Kalp Burası
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var modifiedRequest = this.normalizeRequestHeaders(request);
    return next.handle(modifiedRequest)
      .pipe(
        catchError(error => {
          // if (error instanceof HttpErrorResponse && error.status === 401) {
          //   return this.tryAuthWithRefreshToken(request, next, error);
          // } else {
            return this.handleErrorResponse(error);
          // }
        }),
        switchMap((event) => {
          return this.handleSuccessResponse(event as HttpEvent<any>);
        })
      );
  }


  // protected tryGetRefreshTokenService(): Observable<boolean> {
  //   var _refreshTokenService = this._injector.get(RefreshTokenService, null);

  //   if (_refreshTokenService) {
  //       return _refreshTokenService.tryAuthWithRefreshToken();
  //   }
  //   return of(false);
  // }

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private tryAuthWithRefreshToken(request: HttpRequest<any>, next: HttpHandler, error: any) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return of(false);
      // return this.tryGetRefreshTokenService().pipe(
      //     switchMap((authResult: boolean) => {
      //         this.isRefreshing = false;
      //         if (authResult) {
      //             this.refreshTokenSubject.next(authResult);
      //             let modifiedRequest = this.normalizeRequestHeaders(request);
      //             return next.handle(modifiedRequest);
      //         } else {
      //             return this.handleErrorResponse(error);
      //         }
      //     }));
    } else {
      return this.refreshTokenSubject.pipe(
        filter(authResult => authResult != null),
        take(1),
        switchMap(authResult => {
          let modifiedRequest = this.normalizeRequestHeaders(request);
          return next.handle(modifiedRequest);
        }));
    }
  }

  protected normalizeRequestHeaders(request: HttpRequest<any>): HttpRequest<any> {
    var modifiedHeaders = new HttpHeaders();
    modifiedHeaders = request.headers.set('Content-Type', 'application/json');
    modifiedHeaders = modifiedHeaders.set('Access-Control-Allow-Origin', '*');
    modifiedHeaders = modifiedHeaders.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    modifiedHeaders = this.addAuthorizationHeaders(modifiedHeaders);

    return request.clone({
      headers: modifiedHeaders
    });
  }

  protected addAuthorizationHeaders(headers: HttpHeaders): HttpHeaders {
    let authorizationHeaders = headers ? headers.getAll('Authorization') : null;
    if (!authorizationHeaders) {
      authorizationHeaders = [];
    }

    if (!this.itemExists(authorizationHeaders, (item: string) => item.indexOf('Bearer ') == 0)) {
      let token = this._localStorageService.getItem(AppConsts.lsToken);
      if (headers && token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return headers;
  }

  protected handleSuccessResponse(event: HttpEvent<any>): Observable<HttpEvent<any>> {
    var self = this;

    if (event instanceof HttpResponse) {
      if (event.body instanceof Blob && event.body.type && event.body.type.indexOf("application/json") >= 0) {
        return self._configuration.blobToText(event.body).pipe(
          map(
            json => {
              const responseBody = json == "null" ? {} : JSON.parse(json);

              var modifiedResponse = self._configuration.handleCommonResponse(event.clone({
                body: responseBody
              }));

              return modifiedResponse.clone({
                body: new Blob([JSON.stringify(modifiedResponse.body)], { type: 'application/json' })
              });
            })
        );
      }
    }
    return of(event);
  }

  protected handleErrorResponse(error: any): Observable<never> {
    if (!(error.error instanceof Blob)) {
      return throwError(error);
    }

    return this._configuration.blobToText(error.error).pipe(
      switchMap((json) => {
        const errorBody = (json == "" || json == "null") ? {} : JSON.parse(json);
        const errorResponse = new HttpResponse({
          headers: error.headers,
          status: error.status,
          body: errorBody
        });

        var ajaxResponse = this._configuration.getAjaxResponseOrNull(errorResponse);

        if (ajaxResponse != null) {
          this._configuration.handleResponse(errorResponse, ajaxResponse);
        } else {
          this._configuration.handleNonErrorResponse(errorResponse);
        }

        return throwError(error);
      })
    );
  }

  private itemExists<T>(items: T[], predicate: (item: T) => boolean): boolean {
    for (let i = 0; i < items.length; i++) {
      if (predicate(items[i])) {
        return true;
      }
    }

    return false;
  }
}
