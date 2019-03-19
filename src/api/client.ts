import {Response, SuperAgentStatic} from 'superagent';
import {HttpClient, HttpRequestOptions} from "../types";
import {IRequestController, RequestsController} from "./requests_controller";
import URIJS from 'urijs';


export class Client implements HttpClient {
    baseUrl: string;
    request: SuperAgentStatic;
    defaultOptions: HttpRequestOptions;
    requestsController: IRequestController = new RequestsController();

    constructor(baseUrl: string, agent: SuperAgentStatic) {
        this.baseUrl = baseUrl;
        this.request = agent;
        this.defaultOptions = {
            content_type: 'json',
        }
    }

    get = async (url: string, search: any = {}, options: HttpRequestOptions = this.defaultOptions): Promise<Response> => {
        const actualOptions = Object.assign({},this.defaultOptions, options);
        let requestUrl:string;
        const parsedUri = URIJS(url);
        if (parsedUri.is('absolute')) {
            requestUrl = url;
        } else {
            requestUrl = this.__fullPath(url)
        }
        return this.requestsController.call(() =>
            this.request.get(requestUrl)
                .query(search)
                .responseType(actualOptions.content_type || '')
        );
    };

    getJson = async (url: string, search: any = {}): Promise<any> => {
        const response = await this.get(url, search);
        return response.body;
    };

    postJson = async (url: string, body: any): Promise<any> => {
        const response = await this.requestsController.call(()=> this.request.post(this.__fullPath(url)).send(body));
        return response.body;
    };

    putJson = async (url: string, body: any): Promise<any> => {
        const response = await this.request.put(this.__fullPath(url)).send(body);
        return response.body;
    };

    del = async (url: string): Promise<any> => {
        const response = await this.request.del(this.__fullPath(url));
        return response.body;
    };

    __fullPath = (path: string) => {
        return `${this.baseUrl}${path}`
    };

}