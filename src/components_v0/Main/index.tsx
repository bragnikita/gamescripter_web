import React from "react";
import AdminHeader from "../AdminHeader";
import './styles.scss';
import {observer} from "mobx-react";
import {getStore} from "../../stores/root";
import {screenMargins} from "../widgets/screens";
import {CenteredLoader} from "../widgets/loaders";

const ContentAreaCenter = observer((props: any) => {
    return null;
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

