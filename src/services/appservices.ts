import {AppNotification, LocalStorageService, LocationService, Notificator, TokenService} from '../types';
import {RouterStore} from "mobx-react-router";
import {Action, Location} from "history";
import URIJS from "urijs";
import {computed, observable, runInAction} from "mobx";
import * as NotificationSystem from "react-notification-system";
import {instanceOf} from "prop-types";
import {Notification} from "react-notification-system";

export class BrowserLocalStorage implements LocalStorageService {
    clear = (key: string): void => {
        localStorage.removeItem(key);
    };

    get = (key: string): string | null => {
        return localStorage.getItem(key);
    };

    set = (key: string, value: string): void => {
        localStorage.setItem(key, value);
    };
}

export class ApiTokenService implements TokenService {
    storage: LocalStorageService;
    tokenName: string;

    constructor(token_name: string, storage: LocalStorageService) {
        this.storage = storage;
        this.tokenName = token_name;
    }

    clear = (): void => {
        this.storage.clear(this.tokenName);
    };

    get = (): string | null => {
        const rawVal = this.storage.get(this.tokenName);
        if (rawVal === null) {
            return rawVal;
        } else {
            try {
                return JSON.parse(rawVal);
            } catch (e) {
                return rawVal;
            }
        }
    };

    set = (value: string): void => {
        if (value) {
            this.storage.set(this.tokenName, JSON.stringify(value));
        }
    };
}

export class RouterBasedLocationService implements LocationService {
    @observable private location: Location | undefined = undefined;
    private store: RouterStore;

    constructor(store: RouterStore) {
        this.store = store;
        store.history.listen((location: Location, action: Action) => {
            runInAction("set new location", () => this.location = location);
        })
    }

    @computed get currentUri() {
        if (!this.location) {
            return new URIJS();
        }
        const uriCopy = new URIJS({
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            port: window.location.port,
            path: location.pathname,
            query: location.search,
        });
        uriCopy.hash(location.hash);
        return uriCopy;
    }

    push = (path: string, query: any = {}): void => {
        let resource;
        if (path.startsWith('#')) {
            resource = this.currentUri.clone().fragment(path.substr(1)).normalize().resource();
        } else
            resource = this.currentUri.clone()
                .pathname(path)
                .query(query)
                .fragment('')
                .normalize()
                .resource();
        this.store.history.push(resource)
    };

    replace = (path: string, query: any = {}): void => {
        let resource;
        if (path.startsWith('#')) {
            resource = this.currentUri.clone()
                .hash(path.substr(1))
                .resource()
        } else {
            resource = this.currentUri.clone()
                .pathname(path)
                .query(query)
                .resource();
        }
        this.store.history.replace(resource)
    };

}

export class SimpleNotificationService implements Notificator {
    system?: NotificationSystem.System;
    private notification?: NotificationSystem.Notification;


    constructor() {
    }

    setRef(ref: NotificationSystem.System) {
        this.system = ref;
    }

    clear(): void {
        if (!this.system) return;
        this.system.clearNotifications();
    }

    error(msg?: string): void {
        if (!msg || !this.system) return;
        this.notification = this.system.addNotification({
            message: msg,
            level: 'error',
            position: 'bc',
        });
    }

    message(msg: string | AppNotification): void {
        if (typeof msg === 'string') {
            this.addNotification({
                message: msg as string,
                level: 'error',
                position: 'bc',
            });
        } else {
            this.addNotification(this.buildNotification(msg))
        }
    }

    private addNotification = (n: Notification) => {
        if (!this.system) {
            console.log(n.message)
        } else {
            this.notification = this.system.addNotification(n);
        }
    };

    buildNotification = (n: AppNotification):Notification => {
        // TODO
        return {
            message: n.text || n.name,
            level: 'info',
            position: 'tc'
        }
    }

}
