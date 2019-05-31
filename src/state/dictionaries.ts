import {action, observable, runInAction} from "mobx";
import {plainToClass, Type} from "class-transformer";
import {TextValuePair} from "../stores/types";
import {RootStore} from "./root_store";
import {http} from "../service";

class Dictionary {
    name: string = '';
    title: string = '';
    @Type(() => DictionaryRecord)
    records: DictionaryRecord[] = [];

    getAsDropdownOptions = (): TextValuePair[] => {
        return this.records.map((d) => ({text: d.title, value: d.parameter, key: d.parameter}))
    }
}

class DictionaryRecord {
    parameter: string = '';
    title: string = '';
}

export class DictionariesStore {
    root: RootStore;

    story_types: Dictionary = new Dictionary();
    category_types: Dictionary = new Dictionary();
    script_types: Dictionary = new Dictionary();

    all: Map<string, Dictionary> = new Map();

    @observable loading = false;
    @observable initialized = false;

    constructor(root: RootStore) {
        this.root = root;
    }

    @action preLoad = async () => {
        this.loading = true;
        try {
            const { response: json } = await http().client.getJson('/dictionaries');
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

    getSync = (name: string ) => {
        return this.all.get(name);
    }
}