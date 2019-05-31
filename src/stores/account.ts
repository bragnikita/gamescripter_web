import {FieldState, FormState} from "formstate";
import {required} from "../utils/validators";
import {action, computed, observable, runInAction} from "mobx";
import AppServices from "../services_v0";
import {AccountApi} from "../api/resource_apis";
import {HttpClient} from "../types";
import {getStore} from "./root";

type LoginFormState = {
    username: FieldState<string>,
    password: FieldState<string>
}

class Account {
    username: string;
    isAdmin: boolean;

    constructor(username: string, isAdmin: boolean) {
        this.username = username;
        this.isAdmin = isAdmin;
    }
}

export class AccountStore {
    @observable account: Account | undefined;

    loginForm: FormState<LoginFormState>;
    @observable errorMessage: string | undefined;

    client: AccountApi;

    autoLoginAttempts = 0;

    @computed get isLoggedIn() {
        return !!this.account
    }

    constructor(http: HttpClient) {
        this.client = new AccountApi(http);

        this.loginForm = new FormState({
            username: new FieldState('').validators(required()),
            password: new FieldState('').validators(required()),
        });
        this.loginForm.enableAutoValidation();
    }

    @action tryLogin = async () => {
        const username = this.loginForm.$.username.$;
        const password = this.loginForm.$.password.$;
        const result = await this.client.signIn(username, password);
        if (result) {
            runInAction(() => this.errorMessage = result);
        } else {
            this.account = new Account(username, username === 'admin');
            this.loginForm.reset();
            getStore().ui.navigateAfterLogin();
        }
    };

    @action tryStart = async () => {
        if (this.autoLoginAttempts > 0) {
            return false;
        }
        this.autoLoginAttempts++;
        const user = await this.client.getAccount();
        // const user = await (async() => ({ username: "admin", code: ''}))();
        if (!user) {
            return false;
        }
        if (user.code && user.code === 'not_authenticated') {
            return false;
        }
        this.autoLoginAttempts = 0;
        runInAction(() => {
            this.account = new Account(
                user.username, user.username === 'admin'
            )
        });
        return true;
    };

    @action logout = async () => {
        AppServices.token.clear();
        this.account = undefined;
        await getStore().ui.navigateAfterLogout();
    }
}
