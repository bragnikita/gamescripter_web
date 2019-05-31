import {RootStore} from "./root_store";
import {action, observable} from "mobx";
import createRouter, {Router, State} from "router5";
import {MiddlewareFactory} from "router5/types/types/router";
import browserPlugin from "router5-plugin-browser";

class PageLocalState {
    @observable errors: string[] = [];
}

export class UiStore {
    private root: RootStore;
    private routerRef: Router | undefined;
    publicRoutes = ['sign_in', 'sign_up', 'not_found'];
    redirectIfUnauth = 'sign_in';
    publicOnlyRoutes = ['sign_in', 'sign_up'];
    redirectIfAuth = 'home';

    page = new PageLocalState();
    @observable currentScreenState: State | undefined = undefined;


    constructor(root: RootStore) {
        this.root = root;
    }

    @action
    beforePageChanges = (toState: State) => {
        this.page = new PageLocalState();
        this.currentScreenState = toState;
    };

    @action
    addPageError = (error: string) => {
        if (!this.page.errors.includes(error)) {
            this.page.errors.push(error);
        }
    };

    initializeRouter = (router?: Router) => {
        if (!router) {
            router = createRouter([], {
                defaultRoute: "not_found",
                queryParamsMode: "loose",
                allowNotFound: false
            });
            router.usePlugin(browserPlugin())
        }
        this.routerRef = router;
        const middlewares: MiddlewareFactory[] = [];
        middlewares.push((router) => (toState: State) => {
            this.beforePageChanges(toState);
            return true;
        });
        middlewares.push((router: Router) => async (toState: State) => {
            const loggedIn = this.root.account.isLoggedIn;
            if (loggedIn) {
                if (this.redirectIfAuth) {
                    if (this.publicOnlyRoutes.includes(toState.name)) {
                        throw {redirect: {name: this.redirectIfAuth}}
                    }
                }
            } else {
                if (this.redirectIfUnauth) {
                    if (!(this.publicRoutes.includes(toState.name))) {
                        throw {redirect: {name: this.redirectIfUnauth, params: {returnTo: toState.path}}}
                    }
                }
            }
        });
        router.useMiddleware(...middlewares)
    };

    get router(): Router {
        if (this.routerRef) return this.routerRef;
        throw "Not connected!"
    }
}