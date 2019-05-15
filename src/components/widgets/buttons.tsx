import React, {useState} from 'react';
import {Button, ButtonProps} from "semantic-ui-react";
import AppServices from "../../services";

interface NavButtonProps extends ButtonProps {
    to: string,
    params?: {},
    comp?: React.ComponentType,
    returnTo?: string | boolean
}

export const NavButton = ({
                              to, params = {}, comp = Button, returnTo = false, children, ...rest
                          }: NavButtonProps) => {
    const C = comp;
    const toParams: any = Object.assign({}, params);
    return <C
        onClick={() => {
            if (returnTo) {
                if (typeof returnTo === "string") {
                    toParams.returnTo = returnTo;
                } else {
                    toParams.returnTo = AppServices.location.currentUri.resource();
                }
            }
            AppServices.location.push(to, toParams)
        }}
        {...rest}
    >{children}</C>
};


interface ActionButtonProps extends ButtonProps {
    comp?: React.ComponentType
    preventDefault?: boolean
    runAction(e: React.MouseEvent<HTMLButtonElement>): any;
}

export const ActionButton = ({preventDefault = true, comp = Button, runAction, children, ...rest}: ActionButtonProps) => {
    const [loading, setLoading] = useState(false);

    const C = comp;
    return <C
        loading={loading}
        onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
            preventDefault && event.preventDefault();
            setLoading(true);
            try {
                await runAction(event);
            } finally {
                setLoading(false);
            }
        }}
        {...rest}
    >{children}</C>
};