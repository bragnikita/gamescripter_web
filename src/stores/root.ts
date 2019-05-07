import {AccountStore} from "./account";
import {UsersStore} from "./users";
import CategoriesStore from "./categories";
import {DictionariesStore} from "./dictionaries";
import {UiState} from "./uistate";
import {ClassicScriptStore} from "./scripts";

export interface IRootStore {
    account: AccountStore,
    users: UsersStore,
    categories: CategoriesStore,
    dictionaries: DictionariesStore,
    classic_scripts: ClassicScriptStore,
    ui: UiState,
}

let singletonInstance: IRootStore;

export const setAppStore = (store: IRootStore) => { singletonInstance = store };

export const getStore = ():IRootStore => {
    return singletonInstance;
};

