import {action, observable} from "mobx";
import {Script} from "./scripts";
import {FieldState, FormState} from "formstate";
import {FormStatus, Value} from "./types";
import {CategoriesApi} from "../api/resource_apis";
import {classToPlain, Exclude, Expose, plainToClass, Type} from "class-transformer";
import {jsonToClassSingle} from "../utils/serialization";
import {getStore} from "./root";
import {required} from "../utils/validators";

@Exclude()
export class Category {
    @Expose()
    id: string = '';
    @Expose()
    title: string = '';
    @Expose()
    description: string = '';
    @Expose() @Type(() => Category)
    children: Category[] = [];
    @Expose() @Type(() => Script)
    scripts: Script[] = [];

    @Expose()
    content_type: string = 'general';
    story_type?: string;
    @Expose()
    parent_id?: string;
    @Expose()
    slug: string = '';
    @Expose()
    meta: any = {};

    validate = () => {
        if (!this.children) {
            this.children = [];
        }
        if (!this.scripts) {
            this.scripts = [];
        }
        this.story_type = this.meta.story_type;
        this.children.forEach((c) => c.validate());
    }
}

type CategoryForm = {
    title: FieldState<string>;
    description: FieldState<string>;
    content_type: FieldState<string>;
    story_type: FieldState<string>;
    slug: FieldState<string>;

}

export class CategoryEditorStore {
    @observable form!: FormState<CategoryForm>;
    status!: FormStatus;
    @observable visible = false;
    model!: Category;

    constructor() {
        this.setUpForm(new Category());
    }

    setUpForm(model: Category) {
        this.form = new FormState({
            title: new FieldState(model.title).validators(required()),
            description: new FieldState(model.description),
            content_type: new FieldState(model.content_type || 'general'),
            story_type: new FieldState(model.story_type || 'chara'),
            slug: new FieldState(model.slug),
        });
        this.model = model;
        this.status = new FormStatus();
        this.show(true)
    }

    collect = async () => {
        const res = await this.form.validate();
        if (res.hasError) return null;

        const $ = this.form.$;
        const c:any = {};
        c.title = $.title.$;
        c.description = $.description.$;
        c.content_type = $.content_type.$;
        c.meta = {};
        c.meta.story_type = c.content_type === 'story' ? $.story_type.$ : null;
        if (this.model.id) {
            c.id = this.model.id;
        }
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
        const json:any = await this.editorStore.collect();
        if (!json) return;
        if (json.id) {
            await this.api.update(json.id, json);
        } else {
            json.parent_id = this.currentCategory.existed.id;
            await this.api.create(json);
        }
        this.editorStore.show(false);
        await this.setUp(this.currentCategory.existed.id);
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