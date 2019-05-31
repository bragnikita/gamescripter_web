import {http} from "../service";
import {RootStore} from "./root_store";
import {jsonToClassSingle} from "../utils/serialization";
import {Category} from "../stores/categories";

export default class CategoryScriptsStore {
    private root: RootStore;


    constructor(root: RootStore) {
        this.root = root;
    }

    getCategory = async (id: string) => {
        let { response: category, error } = await http().client.getJson(`/category/${id}`);
        if (error) {
            this.root.ui.addPageError(error.toString())
        }
        const cat = jsonToClassSingle(Category, category);
        cat.validate();
        return cat;
    }

}