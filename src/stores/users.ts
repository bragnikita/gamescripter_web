import {SelectableStore} from "./types";
import {action, observable, runInAction} from "mobx";
import {UsersApi} from "../api/resource_apis";
import {classToPlain, Exclude, plainToClassFromExist} from "class-transformer";
import {ApiError, HttpClient} from "../types";
import {FieldState, FormState} from "formstate";
import {required} from "../utils/validators";

export class User {
    @Exclude({toPlainOnly: true})
    id: string = '';
    @observable username: string = '';
    @observable display_name: string = '';
    @observable avatar_uri: string = '';
    @observable active: boolean = false;
    password: string = '';

    @Exclude()
    store: UsersStore;

    constructor(store: UsersStore) {
        this.store = store;
    }

    edit = () => {
        this.store.setForm(this);
    }

}

type CreateEditForm = {
    username: FieldState<string>,
    password: FieldState<string>,
    displayName: FieldState<string>,
    active: FieldState<boolean>,
}

export class UsersStore implements SelectableStore<User> {
    @observable fetching: boolean = false;
    needRefresh: boolean = true;
    @observable resource: User[] = [];
    @observable selected?: User;

    @observable form?: FormState<CreateEditForm>;
    @observable errorMsg?: string;

    client: UsersApi;

    constructor(http: HttpClient) {
        this.client = new UsersApi(http);

    }

    @action fetch = async (invalidate: boolean = false) => {
        if (!this.fetching && (invalidate || this.needRefresh)) {
            this.fetching = true;
            try {
                this.updateResource(await this.client.list());
                runInAction(() => {
                    this.needRefresh = false;
                });
            } finally {
                runInAction(() => {
                    this.fetching = false;
                });
            }
        }
    };

    @action private updateResource = (coll: any) => {
        this.resource.splice(0, this.resource.length);
        coll.forEach((json: any) => {
            this.resource.push(plainToClassFromExist(new User(this), json));
        })
    };

    @action invalidateCache(): void {
        this.needRefresh = true;
    }

    @action select(resource: User): void {
        this.selected = resource;
    }

    @action unselect = () => {
        this.selected = undefined;
    };

    @action setForm = (user?: User) => {
        if (user) {
            this.select(user);
            this.form = this.fillForm(user);
        } else {
            const user = new User(this);
            this.select(user);
            this.form = this.fillForm(user);
        }
    };

    @action save = async () => {
        if (!this.form || !this.selected) return;
        const user = this.selected;
        const form = this.form.$;
        const params = {
            username: form.username.$,
            display_name: form.displayName.$,
            password: form.password.$
        };
        try {
            if (user.id) {
                await this.client.updateStatus(user.id, params);
                runInAction(() => {
                    plainToClassFromExist(user, params);
                    this.unselect();
                });
            } else {
                const newUser = await this.client.create(params);
                runInAction(() => {
                    plainToClassFromExist(user, newUser);
                    this.resource.push(newUser);
                    this.unselect();
                });
            }
        } catch (e) {
            const err = e as ApiError;
            runInAction(() => this.errorMsg = err.message);
        }
    };

    private fillForm(user: User) {
        return new FormState({
            username: new FieldState(user.username).validators(required()),
            password: new FieldState('').validators(required()),
            displayName: new FieldState(user.display_name),
            active: new FieldState(user.active),
        });
    }

}
