import React from "react";
import {AppRoute} from "../../types";
import Login from "./index";
import {Params, State} from "router5/types/types/base";

export default [
    {
        name: "login", path: "/login",
        listener: new class implements AppRoute {
            comp = <Login />;

            activate(params: Params, prevState?: State) {
            }
        }
    }
];