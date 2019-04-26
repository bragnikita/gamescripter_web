import React, {ReactNode} from "react";
import {Route, Switch} from "react-router";
import Login from "../Login";
import AdminHeader from "../AdminHeader";
import './styles.scss';
import {observer} from "mobx-react-lite";
import defaultRoutesDefs from "../../routes";
import {getStore} from "../../stores/root";
import {screenMargins} from "../widgets/screens";

const ContentAreaCenter = observer((props: any) => {
    const currentRoute = getStore().ui.activatedRoute;
    if (!currentRoute) return null;
    let route = defaultRoutesDefs.map[currentRoute ? currentRoute.name : 'not_found'];
    if (!route) {
        return <div>Route not found</div>
    }
    const listener = route.listener;
    if (listener && listener.comp) {
        return listener.comp;
    }
    return <div>No component for route {route.name} ({route.path})</div>
});

export default class ContentArea extends React.Component<any, {}> {

    render() {
        return <React.Fragment>
            <div className="top app-container">
                <AdminHeader/>
                <div className="top content-layout ui extra top_menu_margin">
                    {screenMargins(
                        <ContentAreaCenter/>
                    )}
                </div>
            </div>
        </React.Fragment>
    }
}

