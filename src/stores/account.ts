import {FieldState, FormState} from "formstate";
import {required} from "../utils/validators";
import {action, computed, observable, runInAction} from "mobx";
import AppServices from "../services";
import {AccountApi} from "../api/resource_apis";
import {HttpClient} from "../types";

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
            AppServices.location.push('/categories');
        }
        // if (!['admin', 'nikita'].includes(username)) {
        //     this.errorMessage = `User ${username} was not found`;
        // } else {
        //     this.account = new Account(username, username === 'admin');
        //     this.loginForm.reset();
        //     AppServices.location.push('/')
        // }
    };

    @action tryStart = async () => {
        const user = await this.client.getAccount();
        if (!user) {
            AppServices.location.push('/login')
        } else {
            runInAction(() => {
                this.account = new Account(
                    user.username, true
                )
            })
        }
    }
}
