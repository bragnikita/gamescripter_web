import {State} from "router5";
import {action, observable} from "mobx";

export class UiState {

    @observable route: State = new class implements State {
        name = 'initial';
        params = {};
        path = '/';
    };
    @observable activatedRoute: State | undefined = undefined;

    constructor() {
    }

    @action('route transition') setRoute = (newState: State) => this.route = newState;
}