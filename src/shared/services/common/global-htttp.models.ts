export interface IValidationErrorInfo {
    message: string;
    field: string;
}

export interface IResponseExceptionInfo {
    exceptionMessage: string;
    details: string;
    referenceErrorCode?: string;
    referenceDocumentLink?: string;
    validationErrors?: IValidationErrorInfo[];
}

export interface IAjaxResponse {
    version: string;
    statusCode: number;
    isError: boolean;
    message: string;
    result?: any;
    targetUrl?: string;
    responseException?: IResponseExceptionInfo;
    // unAuthorizedRequest: boolean;
}