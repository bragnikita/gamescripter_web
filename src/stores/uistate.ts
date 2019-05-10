import {Router, State} from "router5";
import {action, observable} from "mobx";
import {StatusCatcher} from "./types";

export class UiState {

    @observable route: State = new class implements State {
        name = 'initial';
        params = {};
        path = '/';
    };
    @observable activatedRoute: State | undefined = undefined;

    applicationInitState = new StatusCatcher();

    router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    @action
    setActivatedRoot = (s: State) => {
        this.activatedRoute = s;
    };

    @action('route transition') setRoute = (newState: State) => this.route = newState;

    navigateAfterLogin = () => {
        let current = this.router.getState();
        const returnTo = current.params['returnTo'];
        if (returnTo) {
            const nextState = this.router.matchUrl(returnTo);
            if (nextState) {
                this.router.navigate(nextState.name, nextState.params, {replace: true});
            } else {
                return this.router.navigate('categories')
            }
        } else {
            return this.router.navigate('categories')
        }
    };

    navigateAfterLogout = () => {
        return new Promise(resolve => this.router.navigate('login', resolve))
    }
}