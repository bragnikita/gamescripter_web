import React, {ReactNode} from "react";
import {AdminHeader} from "./header";
import './layout.scss';
import {store} from "../service";
import {observer} from "mobx-react-lite";

const useGlobalError = () => {
    return store().ui.page.errors;
};

const PageError = observer(({}: {}) => {
    const errors = useGlobalError();

    if (errors.length === 0) {
        return null;
    }
    return <div>
        {errors.map((e) => {
            return <span key={e}>{e}</span>
        })}
    </div>
});

export const PrivateLayout = (props: { children: ReactNode }) => {
    return <div className="private_layout">
        <AdminHeader/>
        <div className="__content">
            <div className="__column">
                <PageError/>
                {props.children}
            </div>
        </div>
    </div>
};

export const PublicLayout = (props: { children: ReactNode }) => {
    return <div className="public">
        <PageError/>
        {props.children}
    </div>
};

