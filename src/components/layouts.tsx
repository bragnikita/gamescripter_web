import {ReactNode} from "react";
import React from "react";
import {AdminHeader} from "./header";
import './layout.scss';

export const PrivateLayout = (props: {children: ReactNode}) => {
    return <div className="private_layout">
        <AdminHeader/>
        <div className="__content">
            <div className="__column">
            {props.children}
            </div>
        </div>
    </div>
};