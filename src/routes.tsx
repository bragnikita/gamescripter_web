import React from 'react';
import {Router} from "router5";
import {AppNavigationConfig, AuthControlMiddleware} from "./routing";
import {timeout} from "./components/main";

const authControlMiddlewareInstance = new AuthControlMiddleware();

authControlMiddlewareInstance.publicRoutes = ['sign_in', 'sign_up', 'not_found'];
authControlMiddlewareInstance.redirectIfUnauth = 'sign_in';
authControlMiddlewareInstance.publicOnlyRoutes = ['sign_in', 'sign_up'];
authControlMiddlewareInstance.redirectIfAuth = 'home';
authControlMiddlewareInstance.isLoggedIn = () => timeout(10, true);

export const authControlMiddleware = authControlMiddlewareInstance;

export const configure = (router: Router) => {

    const cfg = new AppNavigationConfig(router);

    cfg.addFallbackScreen({
        render: (state) => <div>404 Not found </div>
    });

    cfg.addRoute({name: 'home', path: '/home'}).withScreen({
        before: async () => await timeout(1000, {}),
        render: () => <div>Home</div>
    });

    cfg.addRoute({name: 'sign_in', path: '/sign_in'}).withScreen({
        render: () => <div>Sign in</div>
    }).withOptions({layout: 'public'});

    cfg.addRoute({name: 'sign_up', path: '/sign_up'}).withScreen({
        render: () => <div>Sign up</div>
    }).withOptions({layout: 'public'});

    cfg.addRoute({name: 'category', path: '/category'}).withScreen({
        render: () => <div>Categories</div>
    });

    cfg.addRoute({name: 'category.one', path: '/:id'}).withScreen({
        render: (state) => <div>Category {state.params['id']}</div>
    });

    cfg.addRoute({name: 'script', path: '/script'});
    cfg.addRoute({name: 'script.new', path: '/new?:category'});
    cfg.addRoute({name: 'script.edit', path: '/:id'});
    cfg.addRoute({name: 'settings', path: '/settings'});

    cfg.addRoute({name: 'not_found', path: '/not_found'}).withScreen({
        render: () => <div>Not found</div>
    }).withOptions({layout: 'public'});

    return cfg;
};