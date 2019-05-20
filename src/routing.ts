import {AppRoutingMap} from "./types";
import {createRouter, Middleware, Router, State, transitionPath} from "router5";
import browserPlugin from "router5-plugin-browser";
import {DoneFn} from "router5/types/types/base";
import {UiState} from "./stores/uistate";
import _ from 'lodash';
import {publicRoutes} from "./routes";
import {getStore} from "./stores/root";

export const createTransitionMiddlewareFactory = (routes: AppRoutingMap, store: UiState) => {
    return (router: Router): Middleware => {
        return async (toState: State, fromState: State, done: DoneFn) => {
            console.log('next', toState)
            const prevParams = (fromState || {}).params || {};
            const nextParams = toState.params || {};
            const prevRoute = routes.map[(fromState || {}).name];
            const nextRoute = routes.map[toState.name];
            if (prevRoute && prevRoute.listener && prevRoute.listener.deactivate) {
                await prevRoute.listener.deactivate(prevParams, toState);
            }
            if (nextRoute.listener && nextRoute.listener.redirectTo) {
                throw {redirect: {name: nextRoute.listener.redirectTo }}
            }
            store.route = toState;
            if (nextRoute.listener && nextRoute.listener.activate) {
                await nextRoute.listener.activate(nextParams, fromState);
            }
            store.setActivatedRoot(toState);
            return toState;
        }
    }
};

export class AccessControlMiddleware {

    createMiddleware = (router: Router):Middleware => {

        const store = getStore().account;

        return async (toState, fromState, done) => {
            let path = transitionPath(toState, fromState);
            console.log("trying next state ", toState.name);
            console.log(path);
            console.log(publicRoutes());
            console.log(_.intersection([path.intersection, ...path.toActivate], publicRoutes()));
            const privateRoute = _.intersection([path.intersection, ...path.toActivate], publicRoutes()).length == 0;
            if (privateRoute && !store.isLoggedIn) {
                const res = await getStore().ui.applicationInitState.catchIt(() => {
                   return store.tryStart();
                });
                if (!res) {
                    const redirectTo = router.buildUrl(toState.name, toState.params);
                    throw {redirect: {name: 'login', params: { returnTo: redirectTo }}}
                } else {
                    return toState;
                }
            } else {
                return toState;
            }

        }
    }
}

export const makeMobxRouter = (routes: AppRoutingMap) => {
    const router = createRouter(Object.values(routes.map),
        {
            queryParamsMode: "loose",
            allowNotFound: false,
            defaultRoute: 'not_found',
        }
    );
    router.usePlugin(browserPlugin());
    router.subscribe(state => console.log(state));
    return router;
};