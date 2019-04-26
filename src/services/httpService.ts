import {ApiError, LocationService, TokenService} from "../types";
import {Client} from "../api/client";
import request, {Response, ResponseError, SuperAgentRequest} from 'superagent';
import {RequestsController} from "../api/requests_controller";
import {BACK_END_URL} from '../settings';
import AppServices from "./index";
import {ApiRequestError} from "../utils/errors";

class DefaultApiError implements ApiError {
    code: string = "";
    message: string = "";
    payload: any = {};
}

class HttpServiceBackend {

    private service?: Client;

    private tokenService: TokenService;
    private navigationService: LocationService;

    constructor(tokenService: TokenService, navigationService: LocationService) {
        this.tokenService = tokenService;
        this.navigationService = navigationService;
    }


    private configureAgent = () => {
        return request.agent()
            .use(this.tokenPlugin)
            .use(this.cacheHeadersPlugin)
            .on('response', this.saveToken)
            .on('error', this.errorHandler);
    };

    private getToken = (): string | null => {
        return this.tokenService.get();
    };

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

    private saveToken = (response: Response) => {
        // this.tokenService.set(response.header['x-access-token']);
    };

    private errorHandler = (responseOrError: Response | ResponseError) => {
        if (responseOrError.status === undefined) {
            // network error
            return;
        }
        const response = responseOrError as Response;
        if (response.status === 401) {
        }
    };

    get serviceInstance(): Client {
        if (this.service) {
            return this.service;
        }
        this.initializeService();
        if (this.service)
            return this.service;
        throw "Http service is not run";
    }

    private initializeService() {
        const service = new Client(BACK_END_URL, this.configureAgent());

        const configuredRequestsController = new RequestsController();
        configuredRequestsController.handleOtherErrors = (response: Response | undefined, resolve, reject) => {
            if (response) {
                console.log(`[ERROR]${response.status} - ${response.text}`);
                const err = new ApiRequestError(response);
                if (!err.isRecoverable()) {
                    AppServices.notify.error(err.message);
                }
                reject(err)
            } else {
                console.log("Response object is null - network error");
                AppServices.notify.error('Network error');
            }
        };
        configuredRequestsController.onNeedAuthentication = () => {
            AppServices.notify.message({name: "app.need_relogin" })
        };

        service.requestsController = configuredRequestsController;
        this.service = service;
    }
}

export default HttpServiceBackend;