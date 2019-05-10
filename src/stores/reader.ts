import {StatusCatcher} from "./types";
import {Category} from "./categories";
import {action, runInAction} from "mobx";
import AppServices from "../services";
import {jsonToClassSingle} from "../utils/serialization";

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
}