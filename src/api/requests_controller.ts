import request, {Response} from "superagent";

type Closure = () => Promise<Response>;

export interface IRequestController {
    call(c: Closure): Promise<Response>
}

type DeferredAsyncCall = {
    closure: Closure;
    resolve: (arg: any) => any
    reject: (arg: any) => any
}

export class RequestsController implements IRequestController {

    tokenRefreshInProgress = false;
    waitingRequests: DeferredAsyncCall[] = [];
    onTokenRefresh: () => Promise<any>;
    onNeedAuthentication: () => void;
    handleOtherErrors: (response: request.Response | undefined,
                        resolve: (value?: (PromiseLike<any> | any)) => void,
                        reject: (reason?: any) => void) => any;

    constructor() {
        this.onTokenRefresh = () => Promise.resolve(undefined);
        this.onNeedAuthentication = () => Promise.resolve(undefined);
        this.handleOtherErrors = (response, resolve, reject) => {
            reject(response)
        }
    }

    call = (closure: Closure): Promise<Response> => {
        return new Promise<Response>((resolve, reject) => {
            closure()
                .then(resolve)
                .catch(({status, response}: { status: number | undefined, response: request.Response | undefined }) => {
                    if (!status || !response) {
                        this.handleOtherErrors(response, resolve, reject);
                    } else {
                        if (this.needTokenToBeRefreshed(response)) {
                            if (this.tokenRefreshInProgress) {
                                this.waitingRequests.push({closure, resolve, reject})
                            } else {
                                this.handleRefreshToken().then(() => {
                                    while (this.waitingRequests.length > 0) {
                                        const nextClosure = this.waitingRequests.shift();
                                        nextClosure && nextClosure.closure()
                                            .then(nextClosure.resolve)
                                            .catch(nextClosure.reject);
                                    }
                                    closure().then(resolve).catch(reject);
                                });
                            }
                        } else if (response.status === 401) {
                            this.handleNeedAuthentication();
                        } else {
                            this.handleOtherErrors(response, resolve, reject);
                        }
                    }
                })
        })
    };

    needTokenToBeRefreshed = (response: Response) => {
        // don't know exact conditions
        return false;
    };

    handleNeedAuthentication = () => {
        this.onNeedAuthentication();
    };

    handleRefreshToken = () => {
        return new Promise((resolve, reject) => {
            this.tokenRefreshInProgress = false;
            this.onTokenRefresh().then((arg) => {
                this.tokenRefreshInProgress = false;
                resolve(arg);
            }).catch((err) => {
                this.tokenRefreshInProgress = false;
                reject(err);
            });
        });
    };
}