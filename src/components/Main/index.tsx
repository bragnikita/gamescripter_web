import React from "react";
import AdminHeader from "../AdminHeader";
import './styles.scss';
import {observer} from "mobx-react";
import defaultRoutesDefs from "../../routes";
import {getStore} from "../../stores/root";
import {screenMargins} from "../widgets/screens";
import {CenteredLoader} from "../widgets/loaders";

const ContentAreaCenter = observer((props: any) => {
    const currentRoute = getStore().ui.activatedRoute;
    console.log("trying to display: ");
    console.log(currentRoute);
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

@observer
export default class ContentArea extends React.Component<any, {}> {

    render() {
        if (getStore().ui.applicationInitState.inProcess) {
            return <div className="screen-center">
                <CenteredLoader/>
            </div>
        }
        const account = getStore().account.account;
        if (!account) {
            return <ContentAreaCenter/>
        }
        return <React.Fragment>
            <AdminHeader/>
            <div className="top content-layout ui extra top_menu_margin">
                {screenMargins(
                    <ContentAreaCenter/>
                )}
            </div>
        </React.Fragment>
    }
}

