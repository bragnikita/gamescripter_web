import {IRootStore} from "./stores/root";
import {AppRoutingMap} from "./types";
import {createRouter, Router, Plugin, State, Middleware} from "router5";
import browserPlugin from "router5-plugin-browser";
import {DoneFn} from "router5/types/types/base";
import {UiState} from "./stores/uistate";

const createTransitionMiddlewareFactory = (routes: AppRoutingMap, store: UiState) => {
    return (router: Router): Middleware => {
        return async (toState: State, fromState: State, done: DoneFn) => {
            const prevParams = (fromState || {}).params || {};
            const nextParams = toState.params || {};
            const prevRoute = routes[(fromState|| {}).name];
            const nextRoute = routes[toState.name];
            if (prevRoute) {
                await prevRoute.deactivate(prevParams, toState);
            }
            store.route = toState;
            nextRoute.activate(nextParams, fromState);
        }
    }
};

export const makeMobxRouter = (routes: AppRoutingMap, store: IRootStore) => {
    const router = createRouter(Object.values(routes));
    router.useMiddleware(createTransitionMiddlewareFactory(routes, store.ui));
    router.usePlugin(browserPlugin());
    return router;
};