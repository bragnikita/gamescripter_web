import uri from 'urijs';
import {Response} from 'superagent';

export type AppURI = uri.URI;

export interface LocalStorageService {
    get(key: string): string | null;
    set(key: string, value: string): void;
    clear(key: string): void;
}
export interface LocationService extends RequireNavPush, RequireLocation{
    // currentUri: AppURI,
    // push(path: string, query?: any): void
    replace(path: string, query?: any): void
}
export interface TokenService {
    get(): string | null;
    set(value: string): void;
    clear(): void;
}
export interface HttpRequestOptions {
    content_type?: XMLHttpRequestResponseType,
}
export interface HttpClient extends RequireHttpGet{
    // get(url: string, search?: any, options?: HttpRequestOptions): Promise<Response>;
    getJson(url: string, search?: any): Promise<any>;
    postJson(url: string, body: any): Promise<any>;
    putJson(url: string, body: any): Promise<any>;
    del(url:string): Promise<any>;

}
export interface HttpError {
    isFailedRequest: boolean,
    status: number,
    message: string,
    json?: any,
}

export interface ApiError {
    code: string,
    message: string,
    payload: any,
}

export interface AppNotification {
    name: string,
    text?: string,
    params?: any
}

export interface Notificator {
    error(msg?: string):void;
    message(msg: string | AppNotification): void;
    clear(): void;
}
export interface RequireNavPush {
    push(path: string, query?: any): void
}
export interface RequireLocation {
    currentUri: AppURI
}
export interface RequireHttpGet {
    get(url: string, search?: any, options?: HttpRequestOptions): Promise<Response>;
}
export type RequestConfirmation = (message: string) => Promise<any>;