import {action, observable} from "mobx";
import {Script} from "./scripts";
import {FieldState, FormState} from "formstate";
import {FormStatus, Value} from "./types";
import {CategoriesApi} from "../api/resource_apis";
import {classToPlain, Exclude, Expose, plainToClass, Type} from "class-transformer";
import {jsonToClassSingle} from "../utils/serialization";
import {getStore} from "./root";


export class Category {
    id: string = '';
    title: string = '';
    description: string = '';
    @Type(() => Category)
    @Exclude({toPlainOnly: true})
    children: Category[] = [];
    @Type(() => Script)
    @Exclude({toPlainOnly: true})
    scripts: Script[] = [];

    content_type: string = 'general';
    story_type?: string;

    grouping_type: string = '';
    parent_id?: string;

    link?: string;
    slug: string = '';

    validate = () => {
        if (!this.children) {
            this.children = [];
        }
        if (!this.scripts) {
            this.scripts = [];
        }
    }
}

type CategoryForm = {
    title: FieldState<string>;
    description: FieldState<string>;
    content_type: FieldState<string>;
    story_type: FieldState<string | undefined>;
    grouping_type: FieldState<string>;
    slug: FieldState<string>;

}

export class CategoryEditorStore {
    @observable form!: FormState<CategoryForm>;
    status!: FormStatus;
    @observable visible = false;
    private model!: Category;

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
        this.model = model;
        this.status = new FormStatus();
    }

    apply = () => {
        const $ = this.form.$;
        const c = this.model;
        c.title = $.title.$;
        c.description = $.description.$;
        c.grouping_type = $.grouping_type.$;
        return c;
    };

    @action show = (show: boolean) => {
        this.visible = show
    }
}

class CategoriesStore {
    readonly currentCategory: Value<Category>;

    editorStore: CategoryEditorStore;
    api: CategoriesApi;

    constructor(api: CategoriesApi) {
        this.api = api;
        this.editorStore = new CategoryEditorStore();
        this.currentCategory = new Value<Category>(undefined)
    }

    @action edit = async () => {
        this.editorStore.setUpForm(this.currentCategory.existed);
        this.editorStore.show(true)
    };

    @action newOne = () => {
        this.editorStore.setUpForm(new Category());
        this.editorStore.show(true)
    };

    @action save = async () => {
        const c = this.editorStore.apply();
        if (c.id === this.currentCategory.existed.id) {
            const json = classToPlain(c);
            await this.api.update(c.id, json);
        } else {
            c.parent_id = this.currentCategory.existed.id;
            const json = classToPlain(c);
            await this.api.create(json);
        }
    };

    @action setUp = async (id: string) => {
        this.editorStore.show(false);
        await this.currentCategory.setUp(async () => {
            const category = await this.api.fetch(id);
            const c =  jsonToClassSingle(Category, category);
            c.validate();
            return c;
        })
    };

    getDict(name: string) {
        return getStore().dictionaries.getAsDropdownOptions(name);
    }

}

export default CategoriesStore;