import {action, computed, IObservableArray, observable, ObservableSet, runInAction} from "mobx";
import _ from "lodash";

export type Direction = | "ascending" | "descending" | "none"

export interface SortingState {
    column: string;
    direction: Direction;
}

export interface PagingStatus {
    current: number,
    total: number,
    display: number,
}

export interface TableViewState {
    sorting: SortingState,
    paging: PagingStatus
}

export interface AsyncSubStore<T> {
    items: T[],
    fetching: boolean,
    error?: string,
    needRefresh?: boolean,
}

export interface HasAfterStoreTreeInitializedCallback {
    afterStoreTreeInitialized(): void;
}

export interface SimpleResource<T> {
    resource: T,
    fetching: boolean,
}

export interface SelectableStore<T> extends SimpleResourceStore<T[]> {
    selected?: T,

    select(resource: T): void,

    unselect(): void,
}

export interface SimpleResourceStore<T> extends SimpleResource<T> {
    needRefresh: boolean,

    invalidateCache(): void,

    fetch(invalidate?: boolean): Promise<void>,
}

export class FormStatus {

    state: Set<string> = new ObservableSet();

    constructor(initialState: string = 'pre-initialized') {
        this.addState(initialState);
    }

    @action addState = (state: string) => {
        this.state.add(state)
    };

    setLoading = () => {
        this.addState('loading')
    };
    setValidating = () => {
        this.addState('validating')
    };
    setSubmitting = () => {
        this.addState('submitting')
    };
    setInitialized = () => {
        this.addState('initialized')
    };

    isInStates(list: string[]) {
        return _.some(list, (v) => this.state.has(v));
    }

    isReady = () => !this.isInStates(['loading', 'validating', 'submitting', 'pre-initialized']);
    isLoading = () => this.state.has('loading');
    isValidating = () => this.state.has('validating');
    isSubmitting = () => this.state.has('submitting');
    isInitialized = () => this.state.has('initialized');

}

export class AsyncResource<T> {
    @observable resource: T | undefined;
    @observable fetching: boolean = false;
    @observable stale: boolean = true;

    constructor(initial: T | undefined) {
        this.resource = initial;
    }

    get existed(): T {
        if (this.resource === undefined) {
            throw "Assert violation: the resource must exist"
        }
        return this.resource as T;
    }

    @action
    setUp = async (cb: (set: (val: T | undefined) => void, current: (T | undefined)) => (Promise<void> | void)) => {
        this.fetching = true;
        try {
            await cb(this.setValue, this.resource);
            runInAction(() => {
                this.stale = false
            });
        } finally {
            runInAction(() => this.fetching = false);
        }
    };

    @action setValue = (val: T | undefined) => {
        console.log(val)
        this.resource = val
    };

    exists = () => {
        console.log("exists", this.resource)
        return this.resource !== undefined;
    }
}

export type Nullable<T> = T | undefined

export class Value<T> {
    @observable value: Nullable<T>;
    @observable loading: boolean = false;
    stale: boolean = true;
    error: AppError | undefined = undefined;

    constructor(initial: Nullable<T>) {
        this.value = initial;
    }

    @action
    setUp = async (loader: () => Promise<Nullable<T>>) => {
        try {
            this.loading = true;
            const val = await loader();
            this.setValue(val, false)
        } catch (e) {
            runInAction(() => this.error = new AppError(e))
        } finally {
            runInAction(() => this.loading = false);
        }
    };

    get existed(): T {
        if (this.value === undefined) {
            throw 'Unexpected undefined value'
        }
        return this.value as T;
    };

    exists = () => !(this.value === undefined);

    @action
    private setValue = (val: Nullable<T>, loading: boolean) => {
        this.value = val;
        this.loading = loading;
        this.error = undefined;
        this.stale = false;
    }
}

export class Vector<T> {
    @observable vector: T[];
    @observable loading: boolean = false;
    stale: boolean = true;
    error: AppError | undefined = undefined;

    constructor(initial: T[]) {
        this.vector = initial;
    }

    @action
    setUp = async (loader: () => T[]) => {
        try {
            this.loading = true;
            const val = await loader();
            this.setValue(val, false)
        } catch (e) {
            runInAction(() => this.error = new AppError(e))
        } finally {
            runInAction(() => this.loading = false);
        }
    };

    @action
    private setValue = (val: T[], loading: boolean | undefined) => {
        this.vector.splice(0, this.vector.length);
        this.vector.push(...val);
        if (loading !== undefined)
            this.loading = loading;
        this.error = undefined;
        this.stale = false;
    }


}

export class AppError {
    message: string;

    constructor(err: any) {
        if (err) {
            this.message = err.toString();
        } else {
            this.message = "";
        }
    }
}

export interface TextValuePair {
    text: string,
    value: string,
}

export class StatusCatcher {
    @observable error: AppError | undefined;
    @observable statusMessage: string = "";
    @observable processCounter: number = 0;

    @computed get inProcess() {
        return this.processCounter > 0
    }

    @action
    catchIt = async (cb: ({setStatus}: { setStatus(msg: string): void }) => any) => {
        this.processCounter++;
        this.statusMessage = "";
        this.error = undefined;
        try {
            const res = await cb({
                    setStatus: (msg => {
                        runInAction(() => this.statusMessage = msg);
                    })
                }
            )
            console.log('after cb')
            return res;
        } catch (e) {
            runInAction(() => this.error = e);
            return undefined;
        } finally {
            runInAction(() => {
                this.processCounter--;
            })
        }

    }
}