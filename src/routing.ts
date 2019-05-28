import {Route, Router, State} from "router5";
import {ReactNode} from "react";
import {timeout} from "./components/main";





export class AuthControlMiddleware {
    publicRoutes: string[] = [];
    publicOnlyRoutes: string[] = [];
    redirectIfUnauth: string | undefined = undefined;
    redirectIfAuth: string | undefined = undefined;
    isLoggedIn: () => Promise<boolean> = () => Promise.resolve(true)

    middlewareFactory = (router: Router) => async (toState: State) => {
        const loggedIn = await this.isLoggedIn();
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
    }
}



export interface Screen {
    before?: (to: State) => any;
    render: (to: State) => ReactNode;
}

export class AppNavigationConfig {

    router: Router;
    map: Map<String, RouteConfig> = new Map();
    private fallback: Screen | undefined = undefined;

    constructor(router: Router) {
        this.router = router;
    }

    addRoute(route: Route) {
        this.router.add(route);
        const conf = new RouteConfig(route);
        this.map.set(route.name, conf);
        return conf;
    }

    addFallbackScreen(s: Screen) {
        this.fallback = s;
    }

    getConfig = (routeName: string) => {
        return this.map.get(routeName);
    };

    getFallbackScreen = () => this.fallback
}

export class RouteConfig {
    route: Route;
    screen: Screen | undefined = undefined;
    options: Options = {};
    beforeCallback: (to: State) => any = () => {
    };

    constructor(r: Route) {
        this.route = r;
    }

    withBeforeCallback = (callback: (to: State) => any) => {
        this.beforeCallback = callback;
        return this;
    };
    withScreen = (screen: Screen) => {
        this.screen = screen;
        if (screen.before) {
            this.beforeCallback = screen.before
        }
        return this;
    };
    withOptions = (o: Options) => {
        Object.assign(this.options, o);
        return this;
    }
}

interface Options {
    layout?: string,
}
