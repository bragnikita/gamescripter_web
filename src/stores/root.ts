import {AccountStore} from "./account";
import {UsersStore} from "./users";

interface IRootStore {
    account: AccountStore,
    users: UsersStore,
}

let singletonInstance: IRootStore;

export const setAppStore = (store: IRootStore) => { singletonInstance = store };

export const getStore = ():IRootStore => {
    return singletonInstance;
};

