import * as React from "react";
import {AppRoute, ScreenRoute} from "../../types";
import {Params, State} from "router5/types/types/base";
import EditorScreen from "./index";
import {getStore} from "../../stores/root";

const routes: ScreenRoute[] = [];

const EditorScreenRoute: AppRoute = new class implements AppRoute {
    comp = <EditorScreen />;

    async activate(params: Params, prevState?: State) {
        if (params['id']) {
            return await getStore().classic_scripts.onActivateEditorEdit(params['id']);
        } else {
            return await getStore().classic_scripts.onActivateEditorNew();
        }
    }

    deactivate(params: Params, nextState: State): void {
    }
};

routes.push({
    name: "script_editor_classic-new",
    path: "/script_classic/new",
    listener: EditorScreenRoute,
}, {
    name: "script_editor_classic-edit",
    path: "/script_classic/:id",
    listener: EditorScreenRoute,
});

export default routes;