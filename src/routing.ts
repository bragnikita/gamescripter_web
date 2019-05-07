import {AppRoutingMap} from "./types";
import {createRouter, Middleware, PluginFactory, Router, State} from "router5";
import browserPlugin from "router5-plugin-browser";
import {DoneFn} from "router5/types/types/base";
import {UiState} from "./stores/uistate";

const createTransitionMiddlewareFactory = (routes: AppRoutingMap, store: UiState) => {
    return (router: Router): Middleware => {
        return async (toState: State, fromState: State, done: DoneFn) => {
            const prevParams = (fromState || {}).params || {};
            const nextParams = toState.params || {};
            const prevRoute = routes.map[(fromState || {}).name];
            const nextRoute = routes.map[toState.name];
            if (prevRoute && prevRoute.listener && prevRoute.listener.deactivate) {
                await prevRoute.listener.deactivate(prevParams, toState);
            }
            store.route = toState;
            if (nextRoute.listener && nextRoute.listener.activate) {
                await nextRoute.listener.activate(nextParams, fromState);
            }
            store.setActivatedRoot(toState);
        }
    }
};

export const makeNotLoggedInPlugin = (isLoggedIn: () => boolean): PluginFactory => {

    return (router, dependencies) => {
        return {
            onTransitionStart(toState?: State) {
                if (toState) {
                    if (!isLoggedIn()) {
                        if (toState.name !== 'login') {
                            router && router.navigate('login')
                        }
                    }
                }
            }
        }
    }
};

export const makeMobxRouter = (routes: AppRoutingMap, store: UiState) => {
    const router = createRouter(Object.values(routes.map),
        {
            queryParamsMode: "loose",
            allowNotFound: false,
            defaultRoute: 'not_found',
        }
    );
    router.useMiddleware(createTransitionMiddlewareFactory(routes, store));
    router.usePlugin(browserPlugin());
    router.subscribe(state => console.log(state));
    return router;
};