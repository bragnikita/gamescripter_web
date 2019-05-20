import CategoriesStore, {Category} from "./../categories";
import {CategoriesApi} from "../../api/resource_apis";
import { HttpClient, HttpRequestOptions} from "../../types";
import request from "superagent";
import {AsyncResource} from "../types";
import {inspect} from "util";

const mockHttp = new class implements HttpClient {
    async del(url: string): Promise<any> {
        return undefined;
    }

    async get(url: string, search?: any, options?: HttpRequestOptions): Promise<request.Response> {
        return Promise.reject();
    }

    async getJson(url: string, search?: any): Promise<any> {
        return undefined;
    }

    async postJson(url: string, body: any): Promise<any> {
        return undefined;
    }

    async putJson(url: string, body: any): Promise<any> {
        return undefined;
    }

};

beforeAll(() => {

});

xdescribe('CategoriesStore', () => {
    describe('constructor', () => {
        it('create full structure', async () => {
            const MockedApi = class MockApi extends CategoriesApi {
                fetch = async (id: string) => { return {
                    id: '123',
                    title: 'Cat 1',
                    children: [],
                    scripts: [],
                } };
            };
            const api = new MockedApi(mockHttp);
            const cat = new CategoriesStore(api);
            await cat.setUp('123');
            let currentCategory = cat.currentCategory;
            expect(currentCategory.exists()).toBe(true);
            expect(currentCategory.existed.id).toBe("123");
        });
    })
});

