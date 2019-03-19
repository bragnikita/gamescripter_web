import {action, computed, observable, ObservableSet} from "mobx";
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

