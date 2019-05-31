import {RootStore} from "./root_store";
import {action, computed} from "mobx";
import {Exclude, Expose} from "class-transformer";
import {http, removeToken, saveToken} from "../service";

@Exclude()
class User {
    @Expose()
    username: string = "";
    isAdmin: boolean = false;
}

export class AccountStore {
    root: RootStore;

    user: User | undefined = undefined;
    autoLoginAttempts = 0;


    @action
    trySignIn = async (username: string, password: string) => {
        const {response, error} = await http().client.post('/auth/create', {
            username: username,
            password: password,
        });
        if (!error) {
            saveToken(response.token);
            this.user = new User();
            this.user.username = username;
            this.user.isAdmin = username === 'admin';
            this.autoLoginAttempts = 0;
            await this.root.dictionaries.preLoad();
        } else {
            return error;
        }
    };

    @action
    tryAutoSignIn = async () => {
        if (this.autoLoginAttempts > 0) {
            return false;
        }
        const {response: user, error} = await http().client.getJson('/auth/account');
        if (!error) {
            this.autoLoginAttempts = 0;
            if (user.code && user.code === 'not_authenticated') {
                return false;
            }
            this.user = new User();
            this.user.username = user.username;
            this.user.isAdmin = user.username === 'admin';
            await this.root.dictionaries.preLoad();
        } else {
            this.autoLoginAttempts++;
            return false;
        }
    };

    @action
    logout = async () => {
        this.user = undefined;
        removeToken();
        this.root.ui.router.navigate('sign_in')
    };


    @computed get isLoggedIn() {
        return !!this.user;
    }

    constructor(root: RootStore) {
        this.root = root;
    }


}