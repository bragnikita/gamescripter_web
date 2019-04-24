import React from "react";
import {createRouter, State} from "router5";
import browserPlugin from "router5-plugin-browser";
import {AppRoute, AppRoutingMap} from "./types";
import {getStore} from "./stores/root";
import {CategoriesViewScreen} from "./components/Categories";
import {Params} from "router5/types/types/base";

const routesv = [
    { name: 'home', path: '/' },
    { name: 'categories.root', path: '/category'},
    { name: 'categories.view', path: '/category/:id'}
];


const routes: AppRoutingMap = {};

routes["categories.root"] = new class implements AppRoute {
    comp = <CategoriesViewScreen />;
    name ="categories.root";
    path = "/category";

    activate(params: Params, prevState?: State) {
        return getStore().categories.setUp("");
    }

    deactivate(params: Params, nextState: State) {
    }
};


export default routes;