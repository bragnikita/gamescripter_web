import {AccountStore} from "./account";
import {UsersStore} from "./users";
import CategoriesStore from "./categories";
import {DictionariesStore} from "./dictionaries";
import {UiState} from "./uistate";

export interface IRootStore {
    account: AccountStore,
    users: UsersStore,
    categories: CategoriesStore,
    dictionaries: DictionariesStore,
    ui: UiState,
}

let singletonInstance: IRootStore;

export const setAppStore = (store: IRootStore) => { singletonInstance = store };

export const getStore = ():IRootStore => {
    return singletonInstance;
};

