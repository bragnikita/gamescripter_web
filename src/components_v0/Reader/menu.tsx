import React from 'react';
import {NavButton} from "../widgets/buttons";
import './styles.scss'
import classNames from "classnames";

const WideButton = ({children, subtitle, title,...rest}: any) => {
    const classes = classNames("reader category_menu_button",
        {"w-subtitle" : subtitle});
    return <div className={classes} {...rest}>
        {subtitle && <div className="__subtitle">{subtitle}</div>}
        <div className="__title">{children || title }</div>
    </div>
};

export const CategoryButton = ({title, id, subtitle}: { title: string, subtitle?: string, id: string }) => {
    return <NavButton to="reader.category" params={{id: id}} comp={WideButton} subtitle={subtitle}>
        {title}
    </NavButton>
};