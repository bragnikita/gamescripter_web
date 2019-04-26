import {ApiError, HttpClient} from "../types";
import {inspect} from "util";
import AppServices from "../services";
import {async} from "q";

class Base {
    http: HttpClient;

    constructor(httpClient: HttpClient) {
        this.http = httpClient;
    }
}

export class AccountApi extends Base {
    signIn = async (username: string, password: string) => {
        try {
            const token = await this.http.postJson('/auth/create', {username, password});
            AppServices.token.set(token.token);
            return null;
        } catch (err) {
            return err.message;
        }
    };

    logout = () => {
        AppServices.token.clear();
    }

    getAccount = async() => {
        try {
            return this.http.getJson('/auth/account')
        } catch (err) {
            return null;
        }
    }
}

export class UsersApi extends Base {
    list = async () => await this.http.getJson('/users');
    fetch = async (id: string) => await this.http.getJson(`/users/${id}`);
    create = async (json: any) => await this.http.postJson(`/users`, json);
    del = async (id: string) => await this.http.del(`/users/${id}`);
    updateMeta = async (id: string, params: any) => await this.http.putJson(`/users/${id}/meta`, params);
    updateStatus = async (id: string, params: any) => await this.http.putJson(`/users/${id}/status`, params);
}

export class CategoriesApi extends Base {
    update = async (id: string, json: any) => await this.http.putJson(`/category/${id}`, json);
    create = async (json: any) => await this.http.postJson(`/categories`, json);
    fetch = async (id: string) => {
        if (id) {
            return await this.http.getJson(`/category/${id}`);
        } else {
            return await this.http.getJson('/category/root');
        }
    };
    getParents = async(childId: string) => await this.http.get(`/category/${childId}/parents`);
}

export class DictionariesApi extends Base {
    getAll = async() => await this.http.getJson("/dictionaries")
}

export class ScriptsApi {

}