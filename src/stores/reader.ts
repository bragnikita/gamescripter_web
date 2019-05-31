import {StatusCatcher} from "./types";
import {Category} from "./categories";
import {action, runInAction} from "mobx";
import AppServices from "../services_v0";
import {jsonToClassSingle} from "../utils/serialization";
import {getStore} from "./root";

export class ReaderStore {

    categoryState: StatusCatcher = new StatusCatcher();
    currentCategory: Category | undefined;

    @action
    fetchCategory = (id: string) => {
        this.categoryState.catchIt(async () => {
            const cat = await AppServices.http.getJson(`/reading/c/${id}/display`);
            runInAction(() => {
                this.currentCategory = jsonToClassSingle(Category, cat);
                this.currentCategory.validate();
            })
        })
    }

    readOnly = () => {
        return !getStore().account.isLoggedIn
    }
}