import {HttpClient, LocalStorageService, LocationService, Notificator, TokenService} from "../types";

export class AppServicesHolder {
    location?: LocationService;
    http?: HttpClient;
    token?: TokenService;
    storage?: LocalStorageService;
    notification?: Notificator;

    static instance() {
        return instance;
    }
}

export const instance = new AppServicesHolder();

export default class AppServices {
    static get location(): LocationService {
        if (instance.location) {
            return instance.location;
        }
        throw "Location service is not set"
    }
    static get http(): HttpClient {
        if (instance.http) {
            return instance.http;
        }
        throw "Http service is not set"
    }
    static get token(): TokenService {
        if (instance.token) {
            return instance.token;
        }
        throw "Http service is not set"
    }
    static get storage(): LocalStorageService {
        if (instance.storage) {
            return instance.storage;
        }
        throw "Http service is not set"
    }
    static get notify(): Notificator {
        if (instance.notification) {
            return instance.notification;
        }
        throw "Notification service is not set"
    }
}
