import uri from 'urijs';
import {Response} from 'superagent';
import {Params, State} from "router5/types/types/base";

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

export interface AppError {
    getMessage():string
}

export interface ApiError extends AppError {
    code: string,
    message: string,
    details: any,
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

export interface ScreenRoute {
    name: string,
    path: string,
    listener?: AppRoute,
}

export interface AppRoute {
    comp?: React.ReactElement,
    redirectTo?: string,
    activate?(params: Params, prevState?: State):void
    deactivate?(params: Params, nextState: State): void
}

export interface AppRoutingMap {
    map: {[key: string]: ScreenRoute},
}