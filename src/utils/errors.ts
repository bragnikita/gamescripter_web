import {Response} from "superagent";
import {ApiError} from "../types";

export class ApiRequestError implements ApiError {
    response?: Response;
    message: string;
    status: number;
    json?: any;
    code: string = "";
    details: any;

    constructor(responseObject: any) {
        this.response = responseObject;
        if (responseObject.status === undefined) {
            this.status = 0;
        }
        if (responseObject.constructor && responseObject.constructor.name === 'Error') {
            this.response = responseObject.response;
        }
        this.status = this.getStatus();
        this.json = this.getBodyJson();
        if (this.json) {
            this.details = this.json;
            this.code = this.json.code;
        }
        this.message = this.getMessage();
        if (!this.json) {
            this.details = this.message;
        }
    }

    getMessage = () => {
        if (this.message) return this.message;
        let text = undefined;
        if (!this.response) {
            return 'Network error'
        }

        if (this.json) {
            text = this.json.message;
        }
        if (text) return text;

        text = this.response.text;
        if (text) return text;

        text = (this.response as any)['statusText'];
        if (text) return text;

        return 'Request failed'
    };

    getBodyJson = () => {
        if (this.json) return this.json;
        if (!this.response) return undefined;
        if (this.response.type && this.response.body) {
            if (this.response.type.includes('json')) {
                return this.response.body;
            } else {
                try {
                    return JSON.parse(this.response.body)
                } catch (e) {
                }
            }
        }
        return undefined;
    };

    getStatus = () => {
        if (this.status !== undefined) return this.status;
        if (!this.response) {
            return 0;
        }
        return this.response.status;
    };

    isNetworkError = () => {
        return this.status === 0;
    };
    isClientError = () => {
        if (!this.response) return false;
        return this.response.clientError;
    };
    isServerError = () => {
        if (!this.response) return false;
        return this.response.serverError;
    };
    isRecoverable = () => {
        return this.status == 400 || this.status == 401 || this.status == 422
    };
    toString = () => {
        return this.getMessage();
    }


}