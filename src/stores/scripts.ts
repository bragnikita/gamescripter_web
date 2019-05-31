import {FieldState, FormState} from "formstate";
import {observable, runInAction} from "mobx";
import {CategoriesApi, ScriptsApi} from "../api/resource_apis";
import AppServices from "../services_v0";
import {StatusCatcher, Value} from "./types";
import {BACK_END_URL} from "../settings";
import {getStore} from "./root";
import {inspect} from "util";
import {required} from "../utils/validators";
import App from "../App";

export class Script {
    id: string = '';
    title: string = '';
    category_id: string = '';
    type: string = '';
    source: string = '';
    html: string = '';

    toJson = () => {
        return {title: this.title, category_id: this.category_id}
    };
    fromJson = (json: any) => {
        this.id = json.id;
        this.title = json.title;
        this.category_id = json.category_id;
        this.source = json.source;
        this.html = json.html;
    }
}

type EditorState = {
    script: FieldState<string>,
    title: FieldState<string>,
    type: FieldState<string>,
}

export class ClassicScriptStore {
    script: Value<Script>;
    opState: StatusCatcher = new StatusCatcher();
    @observable previewHtml: string | undefined = undefined;
    @observable form!: FormState<EditorState>;
    private api: ScriptsApi;
    resources_prefix: string = "";
    @observable preview = new Script();

    constructor() {
        this.api = new ScriptsApi(AppServices.http);
        this.script = new Value<Script>(undefined)
    }

    onUpdate = async () => {
        return await this.opState.catchIt(async (cb) => {
            const script = this.script.existed;
            const json = {
                source: this.form.$.script.$,
                title: this.form.$.title.$,
                category_id: this.script.existed.category_id,
                type: this.form.$.type.$,
            };
            if (script.id) {
                await this.api.http.putJson(`/script/${script.id}`, {title: json.title});
                await this.api.http.putJson(
                    `/script/${script.id}/content/update`,
                    json);
            } else {
                const s: any = await this.api.http.postJson("/scripts", json);
                script.fromJson(s);
                await this.api.http.putJson(
                    `/script/${s.id}/content/update`,
                    json);
            }
            cb.setStatus("Saved")
        });
    };

    onPreview = async () => {
        const json = {
            source: this.form.$.script.$,
        };
        const html = await this.opState.catchIt(() => {
            return this.opState.catchIt(() => {
                return this.api.http.postJson("/script/preview", json);
            });
        });
        runInAction(() => {
            this.preview = new Script();
            this.preview.title = this.form.$.title.$;
            this.preview.html = html;
        })
    };

    private updatePreviewWindow = (id: string) => {
        window.open(`${BACK_END_URL}/script/${id}/preview`, 'script_preview', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=no,width=800,height=800')
    };

    onActivateEditorNew = (forCategoryId?: string) => {
        this.script.value = new Script();
        if (forCategoryId) {
            this.script.value.category_id = forCategoryId;
        } else {
            const forCategory = getStore().categories.currentCategory;
            if (!forCategory.exists()) {
                AppServices.location.replace('categories');
                return
            }
            this.resources_prefix = forCategory.existed.resources_prefix;
            this.script.value.category_id = forCategory.existed.id;
        }
        this.script.value.title = new Date().toISOString();
        this.preview = new Script();
        this.setForm(this.script.value)
    };

    onActivateEditorEdit = async (id: string) => {
        const s: any = await this.api.http.getJson(`/script/${id}`);
        console.log(s);
        const script = new Script();
        script.fromJson(s);
        this.script.value = script;
        this.setForm(script);
        const cat = await new CategoriesApi(AppServices.http).fetch(script.category_id);
        this.preview = new Script();
        this.resources_prefix = cat.resources_prefix;
    };

    onRemove = async (id: string) => {
        await this.api.http.del(`/script/${id}`)
    };

    private setForm(s: Script) {
        this.form = new FormState({
            script: new FieldState(s.source || ""),
            title: new FieldState(s.title || "").validators(required()),
            type: new FieldState(s.type || "battle")
        });
    }
}