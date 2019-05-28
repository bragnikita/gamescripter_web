import React from "react";
import {AppRoute} from "../../types";
import {narrow} from "../widgets/screens";
import {UsersManagementScreen} from "./index";
import {Params, State} from "router5/types/types/base";
import {getStore} from "../../stores/root";

export default [
    {
        name: "users", path: "/users",
        listener: new class implements AppRoute {
            comp = narrow(<UsersManagementScreen/>);

            activate(params: Params, prevState?: State) {
                return getStore().users.fetch(true)
            }
        }
    }
];