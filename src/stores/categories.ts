import {action, observable} from "mobx";
import {Script} from "./scripts";
import {FieldState, FormState} from "formstate";
import {FormStatus} from "./types";
import {CategoriesApi} from "../api/resource_apis";
import AppServices from "../services";
import {classToPlain} from "class-transformer";


class Category {
    id: string = '';
    title: string = '';
    description: string = '';
    children: Category[] = [];
    scripts: Script[] = [];

    content_type: string = 'general';
    story_type?: string;

    grouping_type: string = '';

    link?: string;
    slug: string = '';
}

type CategoryForm = {
    title: FieldState<string>;
    description: FieldState<string>;
    content_type: FieldState<string>;
    story_type: FieldState<string | undefined>;
    grouping_type: FieldState<string>;
    slug: FieldState<string>;

}

class CategoryEditorStore {
    @observable form!: FormState<CategoryForm>;
    status!: FormStatus;
    @observable visible = false;

    constructor() {
        this.setUpForm(new Category());
    }

    setUpForm(model: Category) {
        this.form = new FormState({
            title: new FieldState(model.title),
            description: new FieldState(model.description),
            content_type: new FieldState(model.content_type),
            story_type: new FieldState(model.story_type),
            grouping_type: new FieldState(model.grouping_type),
            slug: new FieldState(model.slug),
        });
        this.status = new FormStatus();
    }

}

class CategoriesStore {
    @observable resource?: Category;
    @observable fetching:boolean = false;
    @observable form?: FormState<CategoryForm>;
    @observable errorMsg?: string;

    editorStore: CategoryEditorStore;
    api: CategoriesApi;

    constructor() {
        this.api = new CategoriesApi(AppServices.http);
        this.editorStore = new CategoryEditorStore();
    }

    @action edit = async () => {
        if (!this.resource) return;
        this.editorStore.setUpForm(this.resource);
        this.editorStore.visible = true;
    };

    @action save = async () => {
        if (!this.resource) return;
        const json = classToPlain(this.resource);
        await this.api.update(this.resource.id, json);
    }

}

export default CategoriesStore;