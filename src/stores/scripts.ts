import {FieldState, FormState} from "formstate";
import {observable} from "mobx";
import {ScriptsApi} from "../api/resource_apis";
import AppServices from "../services";
import {StatusCatcher, Value} from "./types";
import {BACK_END_URL} from "../settings";
import {getStore} from "./root";
import {inspect} from "util";

export class Script {
    id: string = '';
    title: string = '';
    category_id: string = '';
    source: string = '';

    toJson = () => {
        return {title: this.title, category_id: this.category_id}
    };
    fromJson = (json: any) => {
        this.id = json.id;
        this.title = json.title;
        this.category_id = json.category_id;
        this.source = json.source;
    }
}

type EditorState = {
    script: FieldState<string>,
    title: FieldState<string>
}

export class ClassicScriptStore {
    script: Value<Script>;
    opState: StatusCatcher = new StatusCatcher();
    @observable form!: FormState<EditorState>;
    private api: ScriptsApi;

    constructor() {
        this.api = new ScriptsApi(AppServices.http);
        this.script = new Value<Script>(undefined)
    }

    onUpdate = async () => {
        return await this.opState.catchIt(async (cb) => {
            const script = this.script.existed;
            const json = {
                content: this.form.$.script.$,
                title: this.form.$.title.$,
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
        await this.onUpdate();
        this.updatePreviewWindow(this.script.existed.id);
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
            this.script.value.category_id = forCategory.existed.id;
        }
        this.script.value.title = new Date().toISOString();
        this.form = new FormState({
            script: new FieldState(""),
            title: new FieldState(""),
        });
    };

    onActivateEditorEdit = async (id: string) => {
        const s: any = await this.api.http.getJson(`/script/${id}`);
        console.log(s);
        const script = new Script();
        script.fromJson(s);
        this.script.value = script;
        this.form = new FormState({
            script: new FieldState(s.source),
            title: new FieldState(s.title),
        });

    }
}