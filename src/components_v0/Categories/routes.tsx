import {AppRoute, ScreenRoute} from "../../types";
import {CategoriesViewScreen} from "./index";
import {Params, State} from "router5/types/types/base";
import {getStore} from "../../stores/root";
import React from "react";
import {narrow} from "../widgets/screens";

const routes: ScreenRoute[] = [];

const CategoriesScreen: AppRoute = new class implements AppRoute {
    comp = narrow(<CategoriesViewScreen/>);

    activate(params: Params, prevState?: State) {
        return getStore().categories.setUp(params['id'] || "");
    }

    deactivate(params: Params, nextState: State) {
    }
};

routes.push({
    name: "categories",
    path: "/categories",
    listener: CategoriesScreen
}, {
    name: "categories.one",
    path: "/:id",
    listener: CategoriesScreen
});


export default routes;