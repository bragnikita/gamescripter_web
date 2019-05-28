import * as React from "react";
import {AppRoute, ScreenRoute} from "../../types";
import {State} from "router5";
import {Params} from "router5/types/types/base";
import ReaderScreen from "./index";
import {getStore} from "../../stores/root";

const routes: ScreenRoute[] = [];

const CategoryReader: AppRoute = new class implements AppRoute {
    comp = <ReaderScreen/>;

    async activate(params: Params, prevState?: State) {
        await getStore().reader_store.fetchCategory(params['id'])
    }

    deactivate(params: Params, nextState: State): void {
    }
};


routes.push({
    name: "reader",
    path: "/reader",
},{
    name: "reader.category",
    path: "/:id",
    listener: CategoryReader,
});

export default routes;