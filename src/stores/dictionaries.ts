import {action, observable, runInAction} from "mobx";
import {DictionariesApi} from "../api/resource_apis";
import AppServices from "../services";
import {plainToClass, Type} from "class-transformer";
import {TextValuePair} from "./types";

class Dictionary {
    name: string = '';
    title: string = '';
    @Type(() => DictionaryRecord)
    records: DictionaryRecord[] = [];
}

class DictionaryRecord {
    parameter: string = '';
    title: string = '';
}

export class DictionariesStore {
    story_types: Dictionary = new Dictionary();
    category_types: Dictionary = new Dictionary();
    script_types: Dictionary = new Dictionary();

    all: Map<string, Dictionary> = new Map();

    @observable loading = false;
    @observable initialized = false;

    api: DictionariesApi;

    constructor() {
        this.api = new DictionariesApi(AppServices.http);
    }

    @action preLoad = async () => {
        this.loading = true;
        try {
            const json = await this.api.getAll();
            const dicts = plainToClass(Dictionary, json);
            dicts.forEach((d) => {
                switch (d.name) {
                    case 'category_types':
                        this.category_types = d;
                        break;
                    case 'script_types':
                        this.script_types = d;
                        break;
                    case 'story_types':
                        this.story_types = d;
                        break;
                }
                this.all.set(d.name, d);
            });
            runInAction(() => this.initialized = true)
        } finally {
            runInAction(() => this.loading = false)
        }
    };

    getAsDropdownOptions = (name: string): TextValuePair[] => {
        const d = this.all.get(name);
        if (!d) {
            return []
        }
        return d.records.map((d) => ({text: d.title, value: d.parameter, key: d.parameter}))
    }
}