import request, {Response, SuperAgentRequest} from 'superagent';
import URIJS from 'urijs';
import {BACK_END_URL} from "../settings";
import {ApiRequestError} from "../utils/errors";
import {store} from "../service";

export type DataResponse = {
    response: any,
    error?: ApiRequestError
}

export type HttpErrorsHandler = (resp: Response, err: ApiRequestError) => DataResponse | undefined
export type GetInterceptor = (url: string, search: {}) => any
export type PostInterceptor = (url: string, data: any) => any

export class Http {

    baseUrl: string = BACK_END_URL;
    defaultErrorsHandler: HttpErrorsHandler = (resp, err) => {
        if (!err.isRecoverable()) {
            console.log(err);
            store().ui.addPageError("Network error.");
            return;
        }
        return {response: resp.body, error: err}
    };
    interceptors: {
        get?: GetInterceptor,
        post?: PostInterceptor,
    } = {};

    get client(): Client {
        const c = new Client();
        c.baseUrl = this.baseUrl;
        c.errorsHandler = this.defaultErrorsHandler;
        c.interceptors = this.interceptors;
        return c;
    }
}

export class Client {

    requestType: string = "application/json";
    responseType: string = "application/json";
    baseUrl: string = "http://localhost";
    interceptors: { get?: GetInterceptor, post?: PostInterceptor } = {};

    errorsHandler: HttpErrorsHandler = (resp, err) => {
        return {response: resp.body, error: err}
    };

    get = async (url: string, search: any = {}): Promise<Response> => {
        return this.client()
            .get(this.buildFullPath(url))
            .query(search)
            .responseType(this.responseType)
    };

    post = async (url: string, data: any = {}, requestType = this.requestType): Promise<DataResponse> => {
        return this.call(async () => {
            const resp = await this.client()
                .post(this.buildFullPath(url))
                .set({'Content-Type': requestType})
                .responseType(this.responseType)
                .send(data);
            return resp.body;
        });
    };


    postJson = async (url: string, data: any = {}) => {
        if (this.interceptors.post) {
            const interceptor = this.interceptors.post;
            return await this.call(() => interceptor(url, data));
        }
        const resp = await this.client()
            .post(this.buildFullPath(url))
            .set({'Content-Type': 'application/json'})
            .send(data);
        return resp.body;
    };

    getJson = async (url: string, search: any = {}) => {
        if (this.interceptors.get) {
            const interceptor = this.interceptors.get;
            const result = await this.call(async () => await interceptor(url, search));
            if (result.response) {
                return result;
            }
        }
        return await this.call(async () => {
            const res = await this.client()
                .get(this.buildFullPath(url))
                .query(search)
                .responseType('json');

            return res.body;
        })
    };

    private call = async <T>(cb: () => Promise<T>): Promise<DataResponse> => {
        return new Promise((resolve, reject) => {
            cb().then((data) => {
                resolve({response: data, error: undefined})
            }).catch((response) => {
                const resp = response as Response;
                const error = new ApiRequestError(response);
                try {
                    const res = this.errorsHandler(resp, error);
                    if (res) {
                        resolve(res)
                    }
                } catch (e) {
                    reject(e)
                }
            });
        });
    };


    private buildFullPath = (path: string) => {
        const parsedUri = URIJS(path);
        if (parsedUri.is('absolute')) {
            return parsedUri.toString();
        } else {
            return `${this.baseUrl}${path}`
        }
    };

    private client() {
        const req = request.agent();
        req.use(this.tokenPlugin);
        req.use(this.cacheHeadersPlugin);
        req.on('response', this.saveToken);
        return req;
    }

    private tokenPlugin = (req: SuperAgentRequest) => {
        const token = this.getToken();
        if (token) {
            req.set('Authorization', `Bearer ${token}`)
        }
    };

    private cacheHeadersPlugin = (req: SuperAgentRequest) => {
        req.set('Cache-Control', 'no-cache,no-store');
        req.set('Pragma', 'no-cache');
    };

    private getToken = (): string | null => {
        return window.localStorage.getItem("token");
    };

    private saveToken = (response: Response) => {
        if (response.header['x-access-token']) {
            window.localStorage.setItem("token", response.header)
        }
    };

}