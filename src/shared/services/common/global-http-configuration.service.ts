import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IAjaxResponse, IResponseExceptionInfo } from './global-htttp.models';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class GlobalHttpConfigurationService {

    defaultError = <IResponseExceptionInfo>{
        exceptionMessage: 'An error has occurred!',
        details: 'Error details were not sent by server.'
    };

    defaultError401 = <IResponseExceptionInfo>{
        exceptionMessage: 'You are not authenticated!',
        details: 'You should be authenticated (sign in) in order to perform this operation.'
    };

    defaultError403 = <IResponseExceptionInfo>{
        exceptionMessage: 'You are not authorized!',
        details: 'You are not allowed to perform this operation.'
    };

    defaultError404 = <IResponseExceptionInfo>{
        exceptionMessage: 'Resource not found!',
        details: 'The resource requested could not be found on the server.'
    };

    // logError(error: IResponseExceptionInfo): void {
    //     // this._logService.error(error);
    // }

    showError(error: IResponseExceptionInfo): any {
        if (error.exceptionMessage) {
            Swal.fire('Hata!!!', error.exceptionMessage, 'error');
        } else {
            // return this._messageService.error(error.message || this.defaultError.message);
        }
    }

    handleTargetUrl(targetUrl: string): void {
        if (!targetUrl) {
            location.href = '/';
        } else {
            location.href = targetUrl;
        }
    }

    handleUnAuthorizedRequest(messagePromise: any, targetUrl?: string) {
        const self = this;

        if (messagePromise) {
            messagePromise.done(() => {
                this.handleTargetUrl(targetUrl || '/');
            });
        } else {
            self.handleTargetUrl(targetUrl || '/');
        }
    }

    handleNonErrorResponse(response: HttpResponse<any>) {
        const self = this;

        switch (response.status) {
            case 401:
                self.handleUnAuthorizedRequest(
                    self.showError(self.defaultError401),
                    '/'
                );
                break;
            case 403:
                self.showError(self.defaultError403);
                break;
            case 404:
                self.showError(self.defaultError404);
                break;
            default:
                self.showError(self.defaultError);
                break;
        }
    }

    //Error Hataları Kalp 2
    handleResponse(response: HttpResponse<any>, ajaxResponse: IAjaxResponse): HttpResponse<any> {
        var newResponse: HttpResponse<any>;

        if (!ajaxResponse.isError) {

            newResponse = response.clone({
                body: ajaxResponse.result
            });

            if (ajaxResponse.targetUrl) {
                this.handleTargetUrl(ajaxResponse.targetUrl);;
            }
        } else {
            
            let errorMessage = this.defaultError;
            newResponse = response.clone({
                body: ajaxResponse.result
            });

            if (ajaxResponse.responseException && ajaxResponse.responseException.exceptionMessage) {
                errorMessage = ajaxResponse.responseException;
            }

            this.showError(errorMessage);

            if (response.status === 401) {
                this.handleUnAuthorizedRequest(null, ajaxResponse.targetUrl);
            }
        }

        return newResponse;
    }

    getAjaxResponseOrNull(response: HttpResponse<any>): IAjaxResponse | null {
        if (!response || !response.headers) {
            return null;
        }

        var contentType = response.headers.get('Content-Type');
        if (!contentType) {
            // this._logService.warn('Content-Type is not sent!');
            return null;
        }

        if (contentType.indexOf("application/json") < 0) {
            // this._logService.warn('Content-Type is not application/json: ' + contentType);
            return null;
        }

        var responseObj = JSON.parse(JSON.stringify(response.body));
        if (!responseObj) {
            return null;
        }

        return responseObj as IAjaxResponse;
    }

    handleCommonResponse(response: HttpResponse<any>): HttpResponse<any> {
        var ajaxResponse = this.getAjaxResponseOrNull(response);
        if (ajaxResponse == null) {
            return response;
        }

        return this.handleResponse(response, ajaxResponse);
    }

    blobToText(blob: any): Observable<string> {
        return new Observable<string>((observer: any) => {
            if (!blob) {
                observer.next("");
                observer.complete();
            } else {
                let reader = new FileReader();
                reader.onload = function () {
                    observer.next(this.result);
                    observer.complete();
                }
                reader.readAsText(blob);
            }
        });
    }
}