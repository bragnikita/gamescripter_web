import {UiStore} from "./ui_store";
import {AccountStore} from "./account_store";
import CategoryScriptsStore from "./category_scripts_store";
import {DictionariesStore} from "./dictionaries";

export class RootStore {
    ui: UiStore;
    account: AccountStore;
    categories: CategoryScriptsStore;
    dictionaries: DictionariesStore;

    constructor() {
        this.ui = new UiStore(this);
        this.account = new AccountStore(this);
        this.categories = new CategoryScriptsStore(this);
        this.dictionaries = new DictionariesStore(this);
    }
}